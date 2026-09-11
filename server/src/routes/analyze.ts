import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { analyzeCivicIssue } from '../services/gemini.js';
import { AnalyzeInputSchema } from '../schemas/civic.js';
import { analyzeRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Allowed image types for multimodal reasoning
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB maximum

/**
 * Validates actual binary file signatures (magic bytes) to prevent extension spoofing.
 */
function validateImageMagicBytes(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true;
  }

  // WebP: RIFF [4 bytes] WEBP
  const isRiff = buffer.subarray(0, 4).toString('ascii') === 'RIFF';
  const isWebp = buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  if (isRiff && isWebp) {
    return true;
  }

  return false;
}

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed types: PNG, JPEG, WebP.`));
    }
  },
});

// Middleware wrapper to catch Multer errors safely
const safeUpload = (req: Request, res: Response, next: NextFunction) => {
  multerUpload.single('image')(req, res, (err: any) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          error: 'Image file exceeds the 10MB upload limit. Please upload a smaller photo.',
        });
      }
      return res.status(400).json({
        error: err.message || 'Invalid file upload request.',
      });
    }
    next();
  });
};

/**
 * POST /api/analyze
 * Live multimodal Gemini civic intent extraction endpoint
 */
router.post('/', analyzeRateLimiter, safeUpload, async (req: Request, res: Response) => {
  try {
    // Validate text inputs against schema constraints
    const inputParsed = AnalyzeInputSchema.safeParse({
      text: req.body.text || undefined,
      location: req.body.location || undefined,
      voiceTranscript: req.body.voiceTranscript || undefined,
    });

    if (!inputParsed.success) {
      return res.status(400).json({
        error: 'Input validation failed. Text description or location is too long.',
      });
    }

    const text = (inputParsed.data.text || '').trim();
    const location = (inputParsed.data.location || '').trim();
    const voiceTranscript = (inputParsed.data.voiceTranscript || '').trim();
    const imageFile = req.file;

    // Reject completely empty inputs
    if (!text && !imageFile && !voiceTranscript) {
      return res.status(400).json({
        error: 'Please provide a text description, recorded voice note, or upload an evidence photo.',
      });
    }

    // Verify binary magic bytes if an image is provided
    if (imageFile) {
      const isValidSignature = validateImageMagicBytes(imageFile.buffer);
      if (!isValidSignature) {
        return res.status(400).json({
          error: 'Uploaded file does not match a valid image signature (JPEG, PNG, WebP).',
        });
      }
    }

    // Call Gemini Multimodal Service
    const result = await analyzeCivicIssue({
      text,
      location: location || undefined,
      voiceTranscript: voiceTranscript || undefined,
      image: imageFile
        ? {
            buffer: imageFile.buffer,
            mimetype: imageFile.mimetype,
          }
        : undefined,
    });

    return res.status(200).json({
      status: 'success',
      data: result,
      meta: {
        engine: result.analysisEngine || 'diagnostic-fallback',
        isFallback: result.analysisEngine !== 'gemini-2.5-flash',
      },
    });
  } catch (error: any) {
    console.error('[Analyze Endpoint Error]:', error?.message || 'Unknown analysis error');
    return res.status(500).json({
      error: 'Unable to analyze civic report at this moment. Please try again.',
    });
  }
});

export default router;
