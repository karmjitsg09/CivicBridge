import { CivicAnalysisResult, CivicReport } from '../types/civic';

export interface DemoScenario {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  iconName: string;
  inputText: string;
  location: string;
  imagePreviewUrl: string;
  analysisResult: CivicAnalysisResult;
}

// Inline lightweight SVG data URLs for realistic demo evidence
export const DEMO_IMAGE_POTHOLE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%25' height='100%25'%3E%3Cdefs%3E%3ClinearGradient id='road' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23334155'/%3E%3Cstop offset='100%25' stop-color='%231e293b'/%3E%3C/linearGradient%3E%3ClinearGradient id='hole' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230f172a'/%3E%3Cstop offset='100%25' stop-color='%23020617'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23road)'/%3E%3Cline x1='0' y1='200' x2='600' y2='200' stroke='%23facc15' stroke-width='8' stroke-dasharray='30 20'/%3E%3Cellipse cx='320' cy='250' rx='160' ry='75' fill='url(%23hole)' stroke='%23475569' stroke-width='6'/%3E%3Cpath d='M200 230 Q280 200 360 220 Q440 250 400 280 Q320 310 240 290 Z' fill='%23020617' opacity='0.8'/%3E%3Ctext x='40' y='60' fill='%23f8fafc' font-family='sans-serif' font-size='22' font-weight='bold'%3EEvidence: Deep Road Depression Outside School Gate%3C/text%3E%3C/svg%3E";

export const DEMO_IMAGE_GARBAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%25' height='100%25'%3E%3Crect width='600' height='400' fill='%23e2e8f0'/%3E%3Crect y='280' width='600' height='120' fill='%2364748b'/%3E%3Cpath d='M150 280 L220 180 L350 210 L480 170 L520 280 Z' fill='%2310b981' opacity='0.85'/%3E%3Ccircle cx='260' cy='250' r='35' fill='%23f59e0b'/%3E%3Ccircle cx='380' cy='230' r='45' fill='%23ef4444' opacity='0.7'/%3E%3Crect x='180' y='210' width='70' height='55' rx='6' fill='%233b82f6' transform='rotate(15 215 237)'/%3E%3Ctext x='40' y='60' fill='%230f172a' font-family='sans-serif' font-size='22' font-weight='bold'%3EEvidence: Uncollected Municipal Waste Spill%3C/text%3E%3C/svg%3E";

export const DEMO_IMAGE_STREETLIGHT = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%25' height='100%25'%3E%3Crect width='600' height='400' fill='%230f172a'/%3E%3Cline x1='280' y1='400' x2='280' y2='100' stroke='%2394a3b8' stroke-width='14'/%3E%3Cpath d='M280 100 Q360 80 400 120' stroke='%2394a3b8' stroke-width='12' fill='none'/%3E%3Cellipse cx='400' cy='130' rx='28' ry='12' fill='%23475569'/%3E%3Ccircle cx='400' cy='140' r='8' fill='%23334155'/%3E%3Ctext x='40' y='60' fill='%23f8fafc' font-family='sans-serif' font-size='22' font-weight='bold'%3EEvidence: Non-Functional Luminaire (Pole %23L-44)%3C/text%3E%3C/svg%3E";

export const DEMO_IMAGE_WATER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%25' height='100%25'%3E%3Crect width='600' height='400' fill='%23f1f5f9'/%3E%3Crect y='260' width='600' height='140' fill='%23cbd5e1'/%3E%3Crect x='100' y='220' width='400' height='36' rx='18' fill='%230284c7'/%3E%3Cpath d='M280 220 C290 140 330 140 340 220' fill='%2338bdf8' opacity='0.8'/%3E%3Cellipse cx='310' cy='310' rx='140' ry='40' fill='%230ea5e9' opacity='0.5'/%3E%3Ctext x='40' y='60' fill='%230f172a' font-family='sans-serif' font-size='22' font-weight='bold'%3EEvidence: High-Pressure Mainline Water Leakage%3C/text%3E%3C/svg%3E";

export const DEMO_IMAGE_TRAFFIC = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%25' height='100%25'%3E%3Crect width='600' height='400' fill='%23e2e8f0'/%3E%3Crect x='250' y='70' width='100' height='260' rx='20' fill='%231e293b' stroke='%23475569' stroke-width='6'/%3E%3Ccircle cx='300' cy='120' r='30' fill='%23450a0a' stroke='%23dc2626' stroke-width='4'/%3E%3Ccircle cx='300' cy='200' r='30' fill='%23facc15' filter='drop-shadow(0 0 10px %23facc15)'/%3E%3Ccircle cx='300' cy='280' r='30' fill='%23022c22'/%3E%3Cline x1='300' y1='330' x2='300' y2='400' stroke='%23334155' stroke-width='16'/%3E%3Ctext x='40' y='45' fill='%230f172a' font-family='sans-serif' font-size='22' font-weight='bold'%3EEvidence: Flashing Amber Signal Lockout%3C/text%3E%3C/svg%3E";

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'pothole',
    title: 'School Gate Pothole',
    category: 'Road Infrastructure',
    shortDesc: 'Deep crater near school entrance causing emergency vehicle swerving.',
    iconName: 'Cone',
    inputText: "There's a huge pothole right outside the Lincoln High School entrance. It's causing cars and school buses to suddenly swerve into incoming traffic during morning rush hour.",
    location: '1420 Lincoln Ave, opposite School Gate 2',
    imagePreviewUrl: DEMO_IMAGE_POTHOLE,
    analysisResult: {
      issueTitle: 'Hazardous Roadway Cavity at Lincoln High School Crossing',
      category: 'Road Infrastructure',
      summary: 'A severe pothole in the active travel lane immediately fronting the high school gate is forcing vehicular evasive maneuvers into oncoming traffic.',
      detailedDescription: 'Subsurface failure and pavement degradation have formed a deep crater approximately 3 feet across in the eastbound lane. Vehicles and school buses are swerving across the center divider to avoid axle damage, creating severe collision and pedestrian hazard during peak school drop-off hours.',
      severity: 'high',
      urgency: 'critical',
      location: {
        provided: true,
        description: '1420 Lincoln Ave, opposite School Gate 2',
      },
      evidence: [
        {
          type: 'text',
          description: 'Citizen report detailing swerving vehicle behavior outside school grounds during rush hour.',
        },
        {
          type: 'image',
          description: 'Photographic evidence displaying a deep asphalt depression spanning the primary lane.',
        },
      ],
      detectedEntities: ['Pothole / Road Cavity', 'School Zone Crosswalk', 'Vehicular Swerve Hazard', 'Asphalt Delamination'],
      recommendedDepartment: 'Department of Transportation & Municipal Road Maintenance',
      recommendedAction: 'Immediate temporary asphalt patch deployment within 12 hours, followed by structural mill and overlay.',
      nextSteps: [
        'Dispatch roadway emergency crew for high-visibility cone placement',
        'Issue temporary traffic calming advisory during school hours',
        'Execute cold-mix compaction repair before next morning school rush',
      ],
      reportDraft: `FORMAL MUNICIPAL ROAD REPAIR REQUEST
Ref: Road Infrastructure / Safety Urgent

LOCATION: 1420 Lincoln Ave (directly opposite Lincoln High School, Gate 2)
CATEGORY: Road Infrastructure & Traffic Safety
SEVERITY: HIGH | URGENCY: CRITICAL

INCIDENT SUMMARY:
A hazardous road depression measuring approximately 3 feet in width and substantial depth is situated directly in the active vehicular path outside the Lincoln High School pedestrian entrance.

OBSERVED RISKS:
- Frequent near-miss head-on collisions due to vehicles swerving across double-yellow lines.
- Heightened danger to student pedestrians crossing during 7:30-8:30 AM drop-off.
- Potential vehicular suspension and wheel damage.

REQUESTED ACTION:
Dispatch road maintenance division to install safety cones immediately and perform asphalt restorative patching today.`,
      confidence: 94,
      uncertainties: ['Exact cavity depth cannot be calibrated precisely without physical laser measurement.'],
      missingInformation: ['Cross-street mile marker if required by county transit records.'],
    },
  },
  {
    id: 'garbage',
    title: 'Roadside Waste Accumulation',
    category: 'Sanitation & Waste',
    shortDesc: 'Garbage accumulation overflowing onto sidewalk and roadway.',
    iconName: 'Trash2',
    inputText: 'Garbage has been piling up beside Oak Street sidewalk for over five days. Bags are torn open, attracting stray animals and blocking the pedestrian walk.',
    location: 'Corner of Oak St and 4th Ave',
    imagePreviewUrl: DEMO_IMAGE_GARBAGE,
    analysisResult: {
      issueTitle: 'Unregulated Solid Waste Overflow Blocking Pedestrian Right-of-Way',
      category: 'Sanitation & Waste Management',
      summary: 'Substantial accumulation of uncollected municipal waste bags overflowing onto the sidewalk and roadway margin for over five days.',
      detailedDescription: 'Commercial and residential refuse bags have accumulated beside the sidewalk corner. Multiple bags have ruptured, dispersing organic and non-recyclable refuse onto the pedestrian path, creating biohazard and vermin proliferation concerns.',
      severity: 'medium',
      urgency: 'high',
      location: {
        provided: true,
        description: 'Corner of Oak St and 4th Ave',
      },
      evidence: [
        {
          type: 'text',
          description: 'Citizen report identifying 5-day continuous accumulation and sidewalk obstruction.',
        },
        {
          type: 'image',
          description: 'Visual evidence of ruptured refuse bags and scattered waste items blocking walkway.',
        },
      ],
      detectedEntities: ['Solid Waste Overflow', 'Sidewalk Obstruction', 'Biohazard Litter', 'Vermin Attractant'],
      recommendedDepartment: 'Department of Public Works — Bureau of Sanitation',
      recommendedAction: 'Priority bulk waste pickup truck dispatch and post-removal sidewalk sanitation pressure wash.',
      nextSteps: [
        'Route emergency collection compactor truck to corner of Oak & 4th',
        'Inspect surrounding properties for unauthorized commercial dumping',
        'Issue sanitation completion log to local neighborhood council',
      ],
      reportDraft: `SOLID WASTE VIOLATION & REMOVAL DISPATCH
LOCATION: Intersection of Oak St and 4th Ave
CATEGORY: Sanitation & Waste Management
SEVERITY: MEDIUM | URGENCY: HIGH

NARRATIVE:
Severe overflow of domestic and commercial refuse has lingered at the intersection of Oak St & 4th Ave for five days. Bags are compromised and litter is spreading across both the public sidewalk and street gutter.

PUBLIC HEALTH CONCERNS:
- Obstruction of ADA-compliant pedestrian sidewalk
- Pest and vermin vector attraction
- Odor and stormwater drain contamination risk

DISPATCH REQUEST:
Schedule immediate mechanical sweep and bulk trash removal within standard municipal 24-hour service level.`,
      confidence: 92,
      uncertainties: ['Source of dumping (residential vs commercial establishment) unknown.'],
      missingInformation: ['Specific property parcel number fronting the accumulation.'],
    },
  },
  {
    id: 'streetlight',
    title: 'Dark Corridor / Light Outage',
    category: 'Public Lighting',
    shortDesc: 'Broken street luminaire creating blackout hazard on residential curve.',
    iconName: 'LightbulbOff',
    inputText: 'The streetlight on the sharp curve of Willow Road has been dark for two weeks. It is pitch black and dangerous for pedestrians walking home.',
    location: 'Willow Road, near Light Pole #L-44',
    imagePreviewUrl: DEMO_IMAGE_STREETLIGHT,
    analysisResult: {
      issueTitle: 'Total Luminaire Outage on High-Risk Residential Curve',
      category: 'Public Lighting & Electrical',
      summary: 'Public luminaire fixture failure on a sharp residential curve on Willow Road resulting in zero night illumination for over fourteen days.',
      detailedDescription: 'Streetlight pole #L-44 has experienced complete photocell or ballast failure, extinguishing illumination along a blind curve. Pedestrians lack designated sidewalks along this corridor and must walk on the shoulder under unlit conditions.',
      severity: 'high',
      urgency: 'medium',
      location: {
        provided: true,
        description: 'Willow Road, near Light Pole #L-44',
      },
      evidence: [
        {
          type: 'text',
          description: 'Citizen testimony confirming two-week persistent failure and blind corner geometry.',
        },
        {
          type: 'image',
          description: 'Asset identification photograph showing pole fixture #L-44 in dark setting.',
        },
      ],
      detectedEntities: ['Streetlight Luminaire Failure', 'Blind Roadway Curve', 'Pedestrian Night Corridor', 'Pole #L-44'],
      recommendedDepartment: 'Bureau of Street Lighting & Municipal Power',
      recommendedAction: 'Bucket-truck dispatch for LED fixture replacement or photocell relay swap.',
      nextSteps: [
        'Lookup pole #L-44 electrical circuit in municipal asset inventory',
        'Schedule bucket truck technician for daytime electrical diagnosis',
        'Verify restoration during evening automated photodiode cycle',
      ],
      reportDraft: `STREET LIGHTING REPAIR WORK ORDER
LOCATION: Willow Road (near Pole ID #L-44)
DEPARTMENT: Bureau of Street Lighting
SEVERITY: HIGH | URGENCY: MEDIUM

DEFECT DESCRIPTION:
Streetlight pole #L-44 located on the sharp curve of Willow Road has been non-operational for approximately two weeks. The outage leaves a 60-meter stretch in complete darkness.

PEDESTRIAN SAFETY CONCERN:
Because Willow Road lacks physical curbing on this section, pedestrians share the unlit roadway shoulder with vehicular traffic.

ACTION REQUEST:
Deploy lighting maintenance technician to inspect wiring, ballast, and lamp unit on pole #L-44.`,
      confidence: 91,
      uncertainties: ['Uncertain whether outage is isolated to single luminaire or circuit breaker branch.'],
      missingInformation: ['Circuit distribution box location.'],
    },
  },
  {
    id: 'water',
    title: 'Pressurized Water Main Leak',
    category: 'Water & Utilities',
    shortDesc: 'Continuous potable water leak from subterranean roadside pipe.',
    iconName: 'Droplets',
    inputText: 'Clean water has been gushing out from under the curb on Maple Street since this morning. The street is flooded and water is running down the storm drain.',
    location: '712 Maple St, near hydrologic box',
    imagePreviewUrl: DEMO_IMAGE_WATER,
    analysisResult: {
      issueTitle: 'Pressurized Water Main Rupture with Roadway Surface Flooding',
      category: 'Water & Public Utilities',
      summary: 'Continuous pressurized potable water discharge from subterranean pipe failure creating street pooling and wasting utility water resources.',
      detailedDescription: 'A significant volume of pressurized clean water is erupting from beneath the roadway curb at 712 Maple St. The stream has flooded the gutter line and is eroding the road sub-base while funneling treated water into storm drains.',
      severity: 'critical',
      urgency: 'critical',
      location: {
        provided: true,
        description: '712 Maple St, near hydrologic box',
      },
      evidence: [
        {
          type: 'text',
          description: 'Report of high-volume potable water discharge and roadway flooding since morning.',
        },
        {
          type: 'image',
          description: 'Photograph displaying pressurized curb boil and street pooling.',
        },
      ],
      detectedEntities: ['Pressurized Main Break', 'Sub-base Erosion Risk', 'Treated Water Loss', 'Gutter Flooding'],
      recommendedDepartment: 'Municipal Water & Sewer Authority',
      recommendedAction: 'Urgent emergency valve shutoff crew dispatch to prevent sinkhole formation.',
      nextSteps: [
        'Isolate valve quadrant on Maple Street to halt water loss',
        'Conduct ground-penetrating inspection for subterranean cavity / sinkhole',
        'Excavate and replace ruptured main collar',
      ],
      reportDraft: `CRITICAL WATER MAIN RUPTURE EMERGENCY REPORT
LOCATION: 712 Maple St (adjacent to curb utility box)
DEPARTMENT: Municipal Water & Sewer Authority
SEVERITY: CRITICAL | URGENCY: CRITICAL

INCIDENT BRIEF:
Active, continuous water discharge under pressure originating from underneath the curbline. Flow rate is substantial enough to create pooling across active lane and erosion along roadway curb.

IMMEDIATE RISKS:
- Structural foundation compromise of asphalt (sinkhole risk)
- Significant loss of municipal treated drinking water
- Reduced water pressure for adjacent residential blocks

REQUEST:
Emergency dispatch of utility isolation unit to shut down local gate valve and execute emergency excavation repair.`,
      confidence: 96,
      uncertainties: ['Pipe diameter and exact depth cannot be verified prior to utility mark-out.'],
      missingInformation: ['Proximity to underground gas or fiber line corridors.'],
    },
  },
  {
    id: 'traffic',
    title: 'Malfunctioning Traffic Signal',
    category: 'Traffic & Safety',
    shortDesc: 'Traffic lights frozen on flashing mode at major 4-way intersection.',
    iconName: 'TrafficCone',
    inputText: 'The traffic lights at 5th and Grand are completely frozen on flashing yellow in all directions. Cars are nearly crashing trying to cross simultaneously.',
    location: 'Intersection of 5th Ave and Grand Blvd',
    imagePreviewUrl: DEMO_IMAGE_TRAFFIC,
    analysisResult: {
      issueTitle: 'Traffic Signal Controller Lockout at Major 4-Way Junction',
      category: 'Traffic Operations & Public Safety',
      summary: 'Automated signal controller malfunction resulting in all-direction flashing yellow state at high-density commercial intersection.',
      detailedDescription: 'The electronic signal controller at 5th Ave & Grand Blvd has entered fail-safe lock mode with simultaneous flashing amber indications. Conflicting right-of-way assumptions between drivers are triggering frequent gridlock and severe collision proximity.',
      severity: 'critical',
      urgency: 'critical',
      location: {
        provided: true,
        description: 'Intersection of 5th Ave and Grand Blvd',
      },
      evidence: [
        {
          type: 'text',
          description: 'User report describing all-direction flashing yellow and gridlock at 5th & Grand.',
        },
        {
          type: 'image',
          description: 'Visual confirmation of illuminated amber conflict beacon.',
        },
      ],
      detectedEntities: ['Signal Controller Fault', 'Intersection Conflict', 'Right-of-Way Hazard', 'Fail-Safe Lockout'],
      recommendedDepartment: 'Department of Transportation — Signal Engineering & Traffic Police',
      recommendedAction: 'Immediate traffic control officer deployment followed by signal cabinet reboot and diagnostic audit.',
      nextSteps: [
        'Notify local traffic precinct for manual intersection traffic direction',
        'Dispatch signal technician to access junction master control cabinet',
        'Reset conflict monitor unit and test phased cycle sequence',
      ],
      reportDraft: `URGENT TRAFFIC SIGNAL MALFUNCTION REPORT
LOCATION: Intersection of 5th Ave and Grand Blvd
DEPARTMENT: Department of Transportation / Traffic Engineering
SEVERITY: CRITICAL | URGENCY: CRITICAL

INCIDENT DESCRIPTION:
Electronic traffic signal system at 5th and Grand has fallen into failure mode with uncontrolled flashing signals, creating high-risk collision conditions at a major four-lane junction.

PUBLIC DANGER:
Multiple near-collisions observed due to lack of clear right-of-way assignment during heavy afternoon traffic flow.

REQUEST:
1. Urgent request for traffic officer manual intersection control.
2. Signal engineering technician dispatch to reboot controller and restore normal phase cycling.`,
      confidence: 97,
      uncertainties: ['Root cause (software glitch vs lightning surge vs physical loop detector fault) unknown.'],
      missingInformation: ['Traffic cabinet ID stamped on metal roadside enclosure.'],
    },
  },
];

export const INITIAL_LEDGER_REPORTS: CivicReport[] = [
  {
    id: 'REP-2026-0814',
    createdAt: '2026-09-10 14:22',
    status: 'IN PROGRESS',
    title: 'Hazardous Roadway Cavity at Lincoln High School Crossing',
    category: 'Road Infrastructure',
    severity: 'high',
    urgency: 'critical',
    location: '1420 Lincoln Ave, opposite School Gate 2',
    description: 'Subsurface pavement failure creating 3ft crater forcing morning vehicles into oncoming traffic.',
    recommendedDepartment: 'Department of Transportation & Municipal Road Maintenance',
    requestedAction: 'Immediate asphalt patch deployment within 12 hours.',
    evidenceCount: 2,
    imagePreviewUrl: DEMO_IMAGE_POTHOLE,
    confidence: 94,
  },
  {
    id: 'REP-2026-0812',
    createdAt: '2026-09-08 09:15',
    status: 'ACTION READY',
    title: 'Solid Waste Overflow on Oak & 4th Sidewalk',
    category: 'Sanitation & Waste Management',
    severity: 'medium',
    urgency: 'high',
    location: 'Corner of Oak St and 4th Ave',
    description: 'Uncollected refuse bags blocking ADA walkway and attracting rodents.',
    recommendedDepartment: 'Department of Public Works — Bureau of Sanitation',
    requestedAction: 'Bulk compactor truck collection and pressure wash.',
    evidenceCount: 2,
    imagePreviewUrl: DEMO_IMAGE_GARBAGE,
    confidence: 92,
  },
  {
    id: 'REP-2026-0801',
    createdAt: '2026-09-02 18:40',
    status: 'RESOLVED',
    title: 'Pedestrian Crossing Light Outage on Pine St',
    category: 'Public Lighting',
    severity: 'medium',
    urgency: 'medium',
    location: 'Pine St & 8th Ave',
    description: 'LED beacon replaced by municipal crew after 48-hour dispatch cycle.',
    recommendedDepartment: 'Bureau of Street Lighting',
    requestedAction: 'Replaced LED lamp driver module.',
    evidenceCount: 1,
    imagePreviewUrl: null,
    confidence: 95,
  },
];
