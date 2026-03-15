import { useState, useEffect, useCallback, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CURRICULUM DATA
// ─────────────────────────────────────────────────────────────────────────────

const PHYSICS = {
  id: "physics",
  title: "Physics Self-Study Curriculum",
  phases: [
    {
      id: "p0", number: "0", title: "Mathematical Scaffolding",
      duration: "6–10 months", tag: "Foundation", color: "#1A7A7A", light: "#E6F4F4",
      intro: "The phase you never got. US physics programs fold mathematical tools in as needed, which means students absorb calculation recipes without understanding the structures those recipes are instances of. The goal here is to see the mathematics as a coherent language — not a toolkit.",
      concurrent: [], concurrentNote: null,
      sections: [
        {
          id: "p0_s1", title: "0.1  Linear Algebra — Rigorously",
          desc: "The standard physics introduction ('a vector is an arrow') breaks down in quantum mechanics, where vectors are functions and operators are infinite-dimensional. Build the abstract foundation now.",
          resources: [
            { id: "r1", type: "PRIMARY", title: "Linear Algebra Done Right", author: "Axler (4th ed.)", why: "Builds from abstract vector spaces with no determinant crutch. Closest to how QM actually uses it.",
              insecure: { advice: "Axler's abstraction can feel groundless without computational intuition first. Work through Strang's MIT 18.06 lectures (free on OCW) for 3–4 weeks to get fluent with matrices and eigenvalues, then return to Axler Chapter 1. The abstraction will feel motivated rather than arbitrary.", alt: "MIT 18.06 Linear Algebra — Strang (free OCW)", altWhy: "Computational fluency first; eigenvalues and row reduction before abstract vector spaces.", reentry: "Return to Axler Ch. 1 after Strang Lectures 1–14." } },
            { id: "r2", type: "SUPPLEMENT", title: "MIT OCW 18.06", author: "Strang (free video lectures)", why: "Computational fluency and geometric intuition alongside Axler's rigor.",
              insecure: { advice: "If the lectures feel too fast, slow down to one per week and work every problem set. The key insight that must land: matrix multiplication is function composition.", alt: "Linear Algebra — Friedberg, Insel & Spence", altWhy: "Tomforde-recommended: more proof-focused than Strang, less abstract than Axler. Good middle ground.", reentry: "Re-watch Strang Lecture 14 (Orthogonal vectors) before moving to inner product spaces in Axler." } },
            { id: "r3", type: "PHYSICS BRIDGE", title: "Mathematical Methods", author: "Boas (Ch. 3, 6)", why: "Connects abstract structure to physics notation. Read alongside Axler.",
              insecure: { advice: "Boas Ch. 3 is the easiest entry in the book — if it feels difficult, the issue is likely comfort with summation notation and index arithmetic. Spend a day on those before re-reading.", alt: null, altWhy: null, reentry: "Work Boas Ch. 3 problems 1–15 before continuing." } }
          ],
          spotlights: [{ type: "MATH SPOTLIGHT", items: ["Eigenvalue decomposition: understand it as a change of basis, not just a calculation procedure", "Spectral theorem: when and why can we diagonalize? This is the heart of QM observables", "Inner product spaces and adjoints: these generalize directly to ⟨ψ|Â|φ⟩ in QM", "The distinction between a vector space and its dual — critical for E&M with differential forms"] }]
        },
        {
          id: "p0_s2", title: "0.2  Complex Analysis",
          desc: "Complex analysis is what makes Fourier transforms, Green's functions, and contour integration all 'work.' Understanding it as geometry pays off for optics and condensed matter.",
          resources: [
            { id: "r4", type: "PRIMARY", title: "Visual Complex Analysis", author: "Needham", why: "Geometric, visual approach. Best book for building true intuition, not mere calculation fluency.",
              insecure: { advice: "Needham is deliberately visual — if a chapter feels unclear, draw every diagram he describes before reading the proof. The geometric picture IS the proof. If the topology in later chapters feels unmotivated, read Stein-Shakarchi Vol. 2 Ch. 1 alongside it.", alt: "Complex Variables and Applications", author2: "Churchill & Brown", altWhy: "Standard calculation reference. Less deep than Needham but more immediately usable for contour integrals.", reentry: "Return to Needham Ch. 3 after working 10 problems from Churchill Ch. 4." } },
            { id: "r5", type: "SUPPLEMENT", title: "Complex Variables", author: "Churchill & Brown", why: "Standard calculation reference for contour integrals, residues, branch cuts.",
              insecure: { advice: "If residue calculations are failing, the issue is almost always branch cuts. Draw the branch cut for every multi-valued function before computing.", alt: "Complex Analysis — Stein & Shakarchi (Princeton Vol. 2)", altWhy: "Tomforde highly recommended: more rigorous than Churchill, unified with the broader Princeton Lectures series.", reentry: "Work Churchill Ch. 6 problems 1–8 (Laurent series) before attempting residue calculations." } }
          ],
          spotlights: [{ type: "MATH SPOTLIGHT", items: ["Cauchy's theorem as a topological statement — the residue is measuring a winding number", "Analytic continuation: why the same function can appear in multiple physical contexts", "Saddle-point (stationary phase) approximation — central to path integrals and WKB"] }]
        },
        {
          id: "p0_s3", title: "0.3  Probability & Statistics as Logic",
          desc: "The single largest gap in US physics training. The Bayesian/Cox approach reveals stat mech as inference under constraints — conceptually transparent.",
          resources: [
            { id: "r6", type: "PRIMARY", title: "Probability Theory: The Logic of Science", author: "Jaynes (Ch. 1–6)", why: "Derives probability from first principles as consistent reasoning. Changes how stat mech feels.",
              insecure: { advice: "Jaynes Ch. 1–2 are the most important and hardest. If the Cox axioms feel unmotivated, read the short essay 'Probability Theory as Extended Logic' (free online) first — it's Jaynes's own accessible introduction.", alt: "Introduction to Probability — Blitzstein & Hwang", altWhy: "More conventional but rigorous; covers all the mechanics Jaynes assumes. Good to have alongside.", reentry: "Return to Jaynes Ch. 2 after working through Blitzstein Ch. 1–4 on conditional probability." } },
            { id: "r7", type: "SUPPLEMENT", title: "Information Theory, Inference & Learning", author: "MacKay (free PDF)", why: "Covers entropy, maximum entropy, and connections to thermodynamics explicitly.",
              insecure: { advice: "MacKay is dense. If a chapter stalls, skip to the summary box at the chapter end, identify the key result, then re-read to find it.", alt: null, altWhy: null, reentry: "Read MacKay Ch. 2 (entropy) before Ch. 3 (data compression)." } },
            { id: "r8", type: "MATH", title: "Introduction to Probability", author: "Blitzstein & Hwang", why: "Rigorous but accessible; covers conditional probability, generating functions, CLT proofs.",
              insecure: { advice: "If Chapter 2 (conditional probability) stalls, the issue is almost always Bayes' theorem. Work through all 10 examples in section 2.3 before proceeding.", alt: null, altWhy: null, reentry: "Work Blitzstein Ch. 2 strategic practice problems before advancing to distributions." } }
          ],
          spotlights: [{ type: "STAT SPOTLIGHT", items: ["Maximum entropy principle: Gibbs/Boltzmann distributions follow from 'least committed' inference given constraints", "Why the equal a priori probability postulate is either assumed or derived — and what it means", "Central Limit Theorem proof via characteristic functions — why macroscopic fluctuations are Gaussian"] }]
        },
        {
          id: "p0_s4", title: "0.4  Differential Equations & PDEs",
          desc: "Most physics is PDEs. The goal is understanding solution structure — when solutions exist, what they look like qualitatively, and how symmetry constrains them.",
          resources: [
            { id: "r9", type: "PRIMARY", title: "Ordinary Differential Equations", author: "Tenenbaum & Pollard", why: "Thorough treatment of existence/uniqueness before methods. Cheap Dover edition.",
              insecure: { advice: "If existence/uniqueness theorems feel overly abstract, skip to the methods chapters and return to them after you have intuition for what solutions look like.", alt: "Differential Equations with Applications — Simmons", altWhy: "More historical context and physical motivation throughout.", reentry: "Re-read Tenenbaum Ch. 3 after working 10 separable ODE examples." } },
            { id: "r10", type: "PDEs", title: "Partial Differential Equations", author: "Strauss", why: "Develops separation of variables, Fourier series, and Green's functions with proofs.",
              insecure: { advice: "If Fourier series convergence in Ch. 5 is unclear, read Stein-Shakarchi Vol. 1 Ch. 2 alongside — it proves the same results with more motivation.", alt: "Applied Partial Differential Equations — Haberman", altWhy: "More applied, more examples, slightly less rigorous. Good if Strauss is too terse.", reentry: "Return to Strauss Ch. 4 after working through all of Ch. 3 (boundary value problems)." } },
            { id: "r11", type: "PHYSICS", title: "Mathematical Methods", author: "Boas (Ch. 8, 13, 15)", why: "Surveys the full toolkit physics uses; read alongside Strauss for physical context.",
              insecure: { advice: "Boas is a reference, not a textbook — use it to check physical applications of results you're proving rigorously in Strauss.", alt: null, altWhy: null, reentry: "Pair each Strauss chapter with the corresponding Boas section." } }
          ],
          spotlights: [{ type: "MATH SPOTLIGHT", items: ["Sturm–Liouville theory: why separation of variables produces orthogonal eigenfunctions — not a lucky coincidence", "Green's functions as distributional inverses of differential operators: unifies propagators in QM, EM, and stat field theory", "Characteristics of hyperbolic vs. parabolic vs. elliptic PDEs — determines what physical boundary conditions are appropriate"] }]
        },
        {
          id: "p0_s5", title: "0.5  Calculus of Variations",
          desc: "Needed for Lagrangian mechanics and, later, path integrals. Treat as a short module.",
          resources: [
            { id: "r12", type: "PRIMARY", title: "Calculus of Variations", author: "Gelfand & Fomin", why: "Rigorous, concise. Proves Euler–Lagrange from first principles with careful boundary terms.",
              insecure: { advice: "If the derivation of the Euler–Lagrange equation feels like symbol manipulation, re-read it as: the functional F[y] is like a function on a space; its 'derivative' is zero at an extremum; the E-L equation is what that zero condition means.", alt: "Calculus of Variations — Forsyth (Dover)", altWhy: "Older, more computational, more examples. Use if Gelfand's terseness is blocking.", reentry: "Work Gelfand Ch. 1 problems 1–6 (brachistochrone variations) before Ch. 2." } }
          ],
          spotlights: []
        }
      ]
    },
    {
      id: "p1", number: "1", title: "Classical Mechanics Rebuilt",
      duration: "4–6 months", tag: "Bridge", color: "#4A6FA5", light: "#E8F0FA",
      intro: "You know classical mechanics. The goal is to re-see it through mathematical structures from Phase 0 — particularly the Hamiltonian formalism, symplectic geometry, and Noether's theorem, all of which reappear in QM and condensed matter.",
      concurrent: [], concurrentNote: null,
      sections: [
        {
          id: "p1_s1", title: "Resources",
          desc: "Work through Goldstein's canonical transformations, Hamilton–Jacobi, and action-angle variable chapters carefully — primary bridges to QM and condensed matter.",
          resources: [
            { id: "r13", type: "PRIMARY", title: "Classical Mechanics", author: "Goldstein, Poole & Safko (3rd ed.)", why: "The graduate standard. Canonical transformations, Hamilton–Jacobi, and action-angle variables are essential bridges to QM.",
              insecure: { advice: "If Goldstein's Chapter 8 (canonical transformations) is opaque, read L&L §45 first — Landau motivates it physically before presenting the formalism.", alt: "Classical Mechanics — Taylor", altWhy: "Rigetti's recommendation: more accessible, excellent problems. Good on-ramp before Goldstein.", reentry: "Return to Goldstein Ch. 8 after working L&L problems §§43–48." } },
            { id: "r14", type: "COMPLEMENT", title: "Mechanics", author: "Landau & Lifshitz Vol. 1", why: "Terse but brilliant. Every sentence earns its place. Read alongside Goldstein for perspective.",
              insecure: { advice: "L&L's terseness is intentional — every problem is derivable from the text but requires work. If §2 (principle of least action) is unclear, re-read it after working the first problem set.", alt: null, altWhy: null, reentry: "Work L&L §1–3 problems before reading §4." } },
            { id: "r15", type: "MATH DEPTH*", title: "Mathematical Methods of Classical Mechanics", author: "Arnold", why: "Optional but spectacular — symplectic manifolds as the natural home of Hamiltonian mechanics. Ch. 1–3 are the directly physics-relevant sections; the rest belongs to the post-physics pure math program.",
              insecure: { advice: "Concurrent chapters for Phase 5–6 (requires T4 first): Ch. 1 (Lagrangian mechanics on manifolds) and Ch. 3 (Hamiltonian formalism, symplectic structure, and Poisson brackets). Prerequisite: Spivak Calculus on Manifolds Ch. 1–3. The remaining chapters (Ch. 4–10: generating functions, integrable systems, perturbation theory, adiabatic invariants) are deep symplectic geometry with limited incremental physics payoff at this level — defer to the Post-Physics Mathematics program. See Post-Physics appendix.", alt: null, altWhy: null, reentry: "Read Arnold Ch. 1 after completing T4. Ch. 3 becomes most useful after Phase 4 when the Poisson bracket → commutator correspondence is clear." } }
          ],
          spotlights: [{ type: "KEY CONNECTIONS", items: ["Poisson brackets → commutators: the correspondence principle is not mysterious once you see it algebraically", "Noether's theorem with proof: every conservation law requires a continuous symmetry", "Phase space and Liouville's theorem: incompressibility of classical probability density — classical precursor to unitarity in QM", "Action-angle variables: bridge to Bohr–Sommerfeld quantization and topological insulators"] }]
        }
      ]
    },
    {
      id: "p2", number: "2", title: "Electromagnetism — Deep Reconstruction",
      duration: "6–9 months", tag: "★ RUSTY", color: "#B8860B", light: "#FFF8E1",
      intro: "Three-layer approach: physical intuition (Purcell), vector calculus fluency (Griffiths), geometric understanding (differential forms). The typical Griffiths course leaves students able to solve boundary value problems but with a fragmented picture of what Maxwell's equations are structurally.",
      concurrent: [], concurrentNote: null,
      sections: [
        {
          id: "p2_s1", title: "Layer 1: Physical Grounding",
          desc: "Purcell derives magnetism from special relativity applied to Coulomb's law. That conceptual anchor changes everything that follows.",
          resources: [
            { id: "r16", type: "PRIMARY", title: "Electricity & Magnetism", author: "Purcell & Morin (3rd ed.)", why: "Derives magnetism from special relativity + Coulomb's law. Builds physical intuition Griffiths assumes.",
              insecure: { advice: "If Purcell's relativistic derivation of magnetism in Ch. 5 is unclear, read the first two pages of Griffiths Ch. 5 first to see where Purcell is headed, then return. The key step: length contraction changes charge density — draw the two frames explicitly.", alt: null, altWhy: null, reentry: "Re-read Purcell Ch. 5.1–5.3 after drawing the charge density diagram yourself." } }
          ],
          spotlights: []
        },
        {
          id: "p2_s2", title: "Layer 2: Mathematical Fluency",
          desc: "Work through Griffiths chapters 2–7 carefully. The goal is fluency with the differential form of Maxwell's equations.",
          resources: [
            { id: "r17", type: "PRIMARY", title: "Introduction to Electrodynamics", author: "Griffiths (4th ed.)", why: "Work chapters 2–7. Goal is fluency with differential Maxwell's equations and Green's function methods.",
              insecure: { advice: "Griffiths' Chapter 3 (boundary value problems) is where most students bog down. There are really only two solution methods: separation of variables and Green's functions. Categorize each problem before solving.", alt: "A Student's Guide to Maxwell's Equations — Fleisch", altWhy: "Rigetti recommended supplement: takes each of the four Maxwell equations and unpacks them completely.", reentry: "Rework Griffiths Ch. 2 examples before attempting Ch. 3 problems." } },
            { id: "r18", type: "PROBLEMS", title: "Problems in General Physics", author: "Irodov (selected E&M sections)", why: "Harder and more physical than Griffiths problems. Alternate between the two.",
              insecure: { advice: "Irodov problems require setting up the physics from scratch. If stuck for more than 45 minutes, draw a careful diagram, identify the symmetry, and restate the problem in symbols before attempting a solution.", alt: null, altWhy: null, reentry: "Start with Irodov §§3.1–3.5 (electrostatics) before moving to magnetostatics." } }
          ],
          spotlights: [{ type: "MATH SPOTLIGHT", items: ["Helmholtz theorem: every vector field decomposes into divergence-free and curl-free parts — this is why E = −∇φ − ∂A/∂t is the general form", "Gauge freedom: the physics of EM is in the field tensor, not the potentials. Derive Lorenz and Coulomb gauges from the same starting point.", "Green's function for the Laplacian: the 1/r potential is the unique solution to ∇²G = −δ³(r). Derive it.", "Radiation and retarded potentials: why information travels at c is encoded in the structure of the wave equation's Green's function"] }]
        },
        {
          id: "p2_s3", title: "Layer 3: Geometric Understanding ★ (Optional)",
          desc: "Differential forms make topological aspects of EM visible — Berry phases, Chern numbers, and topological insulators all use this language.",
          resources: [
            { id: "r19", type: "OPTIONAL", title: "Gauge Fields, Knots and Gravity", author: "Baez & Muniain (Part I)", why: "Rewrites Maxwell's equations using differential forms. Short but deep.",
              insecure: { advice: "If differential forms are new, read MTW Ch. 4 (brief) first — it's the best physics-language introduction to forms.", alt: "Gravitation — Misner, Thorne & Wheeler (Ch. 3–4)", altWhy: "Best introduction to differential forms in a physics context, even though it's a GR textbook.", reentry: "Read Baez Part I Ch. 1 after MTW Ch. 4." } }
          ],
          spotlights: []
        }
      ]
    },
    {
      id: "p3", number: "3", title: "Optics & Modern Physics",
      duration: "4–6 months", tag: "★ RUSTY", color: "#7B4F9E", light: "#F3EAFA",
      intro: "The goal is to see special relativity as geometry (Minkowski spacetime) and to treat the wave-nature of matter as the motivation for Hilbert space in Phase 4.",
      concurrent: ["p3_5"], concurrentNote: "Phase 3 and Phase 3.5 share Fourier vocabulary and can be studied concurrently. Working through Bracewell once while doing both phases is more efficient than reading it twice.",
      sections: [
        {
          id: "p3_s0", title: "3.0  Precursor: Vibrations and Waves",
          desc: "Rigetti treats this as a standalone required course before optics. French provides physical intuition for wave superposition and Fourier methods. Include if normal modes feel procedural rather than intuitive.",
          resources: [
            { id: "r20", type: "PRECURSOR", title: "Vibrations and Waves", author: "French (MIT Intro series)", why: "Damped/forced/coupled oscillators, wave interference, dispersion. Rigetti rates this essential.",
              insecure: { advice: "If normal modes of coupled oscillators (Ch. 4) are unclear, re-read Ch. 2 (free oscillations) and draw the energy diagram for each mode before attempting coupled systems.", alt: null, altWhy: null, reentry: "Work French Ch. 2 problems before Ch. 4 (coupled oscillators)." } },
            { id: "r21", type: "COMPANION", title: "Vibrations and Waves", author: "King", why: "Different problem set and coverage order. Rigetti recommends pairing with French for problem variety.",
              insecure: { advice: "King is most useful for its problem variety. If a French concept is unclear, look up the same concept in King for a different exposition.", alt: null, altWhy: null, reentry: "Use King problems to supplement French, not replace it." } }
          ],
          spotlights: []
        },
        {
          id: "p3_s1", title: "3.1  Wave Optics and Fourier Methods",
          desc: "Fourier analysis treated as mathematics first. The uncertainty principle is a theorem about Fourier pairs, not just a physics postulate.",
          resources: [
            { id: "r22", type: "PRIMARY", title: "Introduction to Optics", author: "Pedrotti, Pedrotti & Pedrotti", why: "Solid treatment of diffraction, interference, coherence, and polarization.",
              insecure: { advice: "If diffraction integrals in Ch. 13 are losing physical meaning, return to the Huygens-Fresnel principle in Ch. 12 and draw the phasor diagram. Every diffraction calculation is a sum of phasors.", alt: "Optics — Hecht (5th ed.)", altWhy: "Rigetti's recommended optics text. Classic, comprehensive, beautiful figures.", reentry: "Re-read Pedrotti Ch. 12 (Huygens) before Ch. 13 (diffraction theory)." } },
            { id: "r23", type: "MATH", title: "The Fourier Transform and Its Applications", author: "Bracewell", why: "Fourier analysis done properly, with sampling theorem and convolution. Pays dividends in spectroscopy and QM.",
              insecure: { advice: "If the convolution theorem is not making physical sense, work this example: blurring an image is convolution with the blur kernel. Its Fourier transform is pointwise multiplication. Smearing in space = weighting in frequency — that picture is everything.", alt: "Fourier Analysis — Stein & Shakarchi (Princeton Vol. 1)", altWhy: "Tomforde-recommended: rigorous treatment with proofs. Most physics-facing of the Princeton series.", reentry: "Work Bracewell Ch. 3 (convolution) problems before Ch. 6 (sampling)." } }
          ],
          spotlights: [{ type: "MATH SPOTLIGHT", items: ["Fourier transform as a unitary operator on L²: position/momentum duality in QM is this, not magic", "Uncertainty principle as a property of Fourier pairs: Δx·Δk ≥ 1/2 is a theorem about functions", "Transfer function formalism in optics: a lens is a Fourier transform. Understand why."] }]
        },
        {
          id: "p3_s2", title: "3.2  Special Relativity as Geometry",
          desc: "Lorentz transformations are rotations in Minkowski space. Learn the 4-vector language now — it reappears everywhere.",
          resources: [
            { id: "r24", type: "PRIMARY", title: "Special Relativity", author: "Helliwell", why: "Spacetime diagrams as the primary language. Better geometric intuition than Taylor & Wheeler.",
              insecure: { advice: "If simultaneity feels paradoxical, the resolution is always the same: draw the spacetime diagram. Every apparent paradox is a failure to draw both frames correctly.", alt: "Spacetime Physics — Taylor & Wheeler", altWhy: "Excellent problem sets; the twin paradox chapter is definitive. More worked examples than Helliwell.", reentry: "Re-read Helliwell Ch. 2 after drawing 10 spacetime diagrams for different inertial frames." } },
            { id: "r25", type: "SUPPLEMENT", title: "Spacetime Physics", author: "Taylor & Wheeler", why: "Excellent problem sets; the twin paradox chapter is definitive.",
              insecure: { advice: "The twin paradox resolution is the best in print. If it remains paradoxical, the issue is the asymmetry of the turnaround — one twin accelerates. Re-read the turnaround section with that in mind.", alt: null, altWhy: null, reentry: "Work T&W problems 1–8 (invariant interval) before moving to 4-vectors." } }
          ],
          spotlights: []
        }
      ]
    },
    {
      id: "p3_5", number: "3.5", title: "Experimental Methods & Signal Analysis",
      duration: "3–5 months", tag: "★ NEW", color: "#C0392B", light: "#FFF0F0",
      intro: "Fills the most persistent gap in theoretical physics education: the tools needed to extract meaning from real data. Error propagation, noise characterization, and spectral estimation are the language in which experimental results are stated.",
      concurrent: ["p3"], concurrentNote: "Run concurrently with Phase 3. Both phases use Bracewell's Fourier book — working through it once serves both. Phase 3.5 deepens the statistical foundations from Phase 0.3.",
      sections: [
        {
          id: "p35_s1", title: "3.5.1  Error Analysis — Rigorous Treatment",
          desc: "The 'add in quadrature' recipe is a theorem about Gaussians, not an axiom. Understanding where it comes from — and when it fails — requires probability theory from Phase 0.3.",
          resources: [
            { id: "r26", type: "PRIMARY", title: "Data Reduction and Error Analysis", author: "Bevington & Robinson (3rd ed.)", why: "Standard experimental physics reference. Covers error propagation, least-squares, and goodness-of-fit.",
              insecure: { advice: "If error propagation feels like a recipe, re-derive it: start from z = f(x,y), Taylor expand around the mean, square and take expectation. You get the quadrature formula. Every step uses only calculus and the definition of variance.", alt: "Statistical Data Analysis — Cowan", altWhy: "Graduate-level: more rigorous on hypothesis testing and confidence intervals.", reentry: "Re-derive the error propagation formula for z = x/y before reading Bevington Ch. 4." } },
            { id: "r27", type: "DEEPER", title: "Statistical Data Analysis", author: "Cowan", why: "Graduate treatment: hypothesis testing, confidence intervals, and likelihood ratios treated rigorously.",
              insecure: { advice: "Cowan's confidence intervals (Ch. 7) are dense. Read Sivia Ch. 2 alongside for the Bayesian perspective on the same quantities.", alt: null, altWhy: null, reentry: "Read Cowan Ch. 4 (parameter estimation) before Ch. 7 (confidence intervals)." } },
            { id: "r28", type: "BAYESIAN", title: "Data Analysis: A Bayesian Tutorial", author: "Sivia & Skilling (2nd ed.)", why: "Bayesian approach to experimental data: model comparison, parameter estimation, uncertainty propagation.",
              insecure: { advice: "Sivia Ch. 1–2 are essentially a worked example of the Jaynes framework from Phase 0.3 applied to measurement. If Sivia is unclear, re-read Jaynes Ch. 1 first.", alt: null, altWhy: null, reentry: "Read Sivia Ch. 1 immediately after Jaynes Ch. 1–2." } }
          ],
          spotlights: [{ type: "STAT SPOTLIGHT", items: ["Error propagation from first principles: the delta method — a Taylor expansion of f around the mean. Fails for non-Gaussian distributions or large uncertainties.", "Chi-squared as a goodness-of-fit statistic: a sum of squared standard normal variables. Its distribution is a consequence of the CLT.", "Maximum likelihood vs. least squares: LS is ML when noise is Gaussian and i.i.d. When noise is non-Gaussian, LS is the wrong estimator.", "Systematic vs. statistical uncertainty: systematic errors do not average away. They require a model of the apparatus."] }]
        },
        {
          id: "p35_s2", title: "3.5.3  Signal Analysis, Noise, and Convolution",
          desc: "Signal analysis is where Fourier methods meet probability theory. Central objects: power spectral density, autocorrelation function, and convolution — and their relationships (Wiener–Khinchin theorem).",
          resources: [
            { id: "r29", type: "PRIMARY", title: "The Fourier Transform and Its Applications", author: "Bracewell (convolution & correlation chapters)", why: "Work the convolution, correlation, and sampling chapters in depth. Same book as Phase 3.",
              insecure: { advice: "If Wiener-Khinchin (S(ω) = F{R(τ)}) isn't making sense, work the proof: write R(τ) as an expectation value, take the Fourier transform, and manipulate. Autocorrelation and PSD are a Fourier pair — a deep fact.", alt: "Introduction to Signal Processing — Hamming", altWhy: "Physical intuition throughout; covers digital filters and spectral leakage clearly.", reentry: "Work Bracewell Ch. 6 (correlation) before Ch. 7 (spectral analysis)." } },
            { id: "r30", type: "NOISE*", title: "Noise and Fluctuations", author: "MacDonald", why: "Johnson–Nyquist noise, shot noise, 1/f noise — each derived from physical models.",
              insecure: { advice: "MacDonald requires stat mech (Phase 5) for the Johnson noise derivation. If reading before Phase 5, skip Ch. 4 and return to it after Pathria Ch. 15.", alt: null, altWhy: null, reentry: "Read MacDonald Ch. 2 (shot noise) before Ch. 4 (thermal noise)." } }
          ],
          spotlights: [{ type: "MATH SPOTLIGHT", items: ["Convolution theorem: F{f * g} = F{f} · F{g}. Convolution in space = multiplication in frequency.", "Wiener–Khinchin theorem: PSD S(ω) is the Fourier transform of autocorrelation R(τ).", "Nyquist–Shannon sampling theorem: a band-limited signal is perfectly reconstructed from samples at ≥ 2f_max.", "Windowing and spectral leakage: truncation in time = convolution with sinc in frequency."] }]
        }
      ]
    },
    {
      id: "p4", number: "4", title: "Quantum Mechanics",
      duration: "6–9 months", tag: "Core", color: "#1A7A7A", light: "#E6F4F4",
      intro: "Primary reference is Shankar — the most mathematically explicit QM textbook at the undergrad-to-grad level. Begins with linear algebra (now review from Phase 0) then derives the postulates from what linear algebra requires of any probabilistic theory of measurement.",
      concurrent: ["p5"], concurrentNote: "The density matrix formalism in QM and the partition function in stat mech are mirror images — both are probability distributions on a space of states. Working through Shankar's density matrix chapter (Ch. 14) while beginning Pathria creates productive cross-illumination.",
      sections: [
        {
          id: "p4_s1", title: "Primary Resources",
          desc: "Work through Shankar in order. The linear algebra chapter is review — use it to build speed before the new physics begins in Ch. 4.",
          resources: [
            { id: "r31", type: "PRIMARY", title: "Principles of Quantum Mechanics", author: "Shankar (2nd ed.)", why: "Starts from Hilbert space axioms. Derives the position representation, not assumes it. Gold standard for mathematical clarity.",
              insecure: { advice: "If Ch. 4 (postulates) feels unmotivated, re-read Ch. 1–2 with explicit attention to the analogy table at the end of Ch. 1. If Ch. 10 (harmonic oscillator) loses physical intuition, read Griffiths Ch. 2 alongside for the wavefunction picture.", alt: "Introduction to Quantum Mechanics — Griffiths (3rd ed.)", altWhy: "Rigetti's undergraduate QM recommendation. More intuitive entry, excellent problems. Less rigorous on Hilbert space but clearer on wave mechanics.", reentry: "Work Shankar Ch. 1 exercises 1.1–1.8 before advancing to Ch. 4." } },
            { id: "r32", type: "COMPLEMENT", title: "Modern Quantum Mechanics", author: "Sakurai & Napolitano (3rd ed.)", why: "Dirac notation from chapter 1. Better for angular momentum, identical particles, and perturbation theory.",
              insecure: { advice: "If Sakurai's treatment of angular momentum (Ch. 3) is unclear, work through the proof that [Lx, Ly] = iℏLz from first principles before reading about raising/lowering operators — they are consequences of this algebra.", alt: null, altWhy: null, reentry: "Read Sakurai Ch. 1.1–1.4 (ket formalism) before Ch. 3 (angular momentum)." } },
            { id: "r33", type: "PATH INTEGRALS*", title: "Quantum Mechanics and Path Integrals", author: "Feynman & Hibbs", why: "Optional depth. Path integral formulation connects to stat mech partition functions and condensed matter.",
              insecure: { advice: "Path integrals require comfort with Gaussian integrals and Lagrangian mechanics. If the derivation in Ch. 2 is unclear: each factor in the product integral is a short-time propagator; you are summing over all paths. The stationary phase approximation recovers classical mechanics.", alt: null, altWhy: null, reentry: "Read F&H Ch. 2 after working through Goldstein Ch. 10 (Hamilton-Jacobi) carefully." } }
          ],
          spotlights: [
            { type: "MATH SPOTLIGHT", items: ["Spectral theorem in action: why observables must be Hermitian — not as a postulate, but as a requirement for real eigenvalues", "Completeness relations: ∫|x⟩⟨x|dx = 1 is the Fourier inversion theorem in Dirac form", "Stone's theorem: the Hamiltonian generates time evolution because time evolution must be a unitary one-parameter group", "WKB as saddle-point approximation: the semiclassical limit is stationary-phase from Phase 0.2"] },
            { type: "STAT SPOTLIGHT", items: ["Density matrix as probability distribution on Hilbert space — connect to Jaynes from Phase 0.3", "Entanglement entropy and reduced density matrices: preview of quantum information in Phase 8", "Decoherence: why macroscopic superpositions vanish — a statistical argument, not a dynamical mystery"] }
          ]
        }
      ]
    },
    {
      id: "p5", number: "5", title: "Statistical Mechanics & Thermodynamics",
      duration: "6–9 months", tag: "★ RUSTY", color: "#B8860B", light: "#FFF8E1",
      intro: "This is where the Phase 0.3 investment pays off most visibly. The Jaynes approach makes the Boltzmann distribution transparent: it is the maximally non-committal probability assignment consistent with known average energy.",
      concurrent: ["p4"], concurrentNote: "Density matrices (Phase 4) and partition functions (Phase 5) are the same mathematical object viewed from different angles. Working the tail of Phase 4 concurrently with the start of Phase 5 makes both clearer.",
      sections: [
        {
          id: "p5_s1", title: "5.1  Thermodynamics — Two Approaches",
          desc: "Genuine choice between two philosophies. Neither replaces the other; the ideal path is Schroeder Ch. 1–3 for physical grounding, then Callen in full for axiomatic structure.",
          resources: [
            { id: "r34", type: "AXIOMATIC", title: "Thermodynamics", author: "Callen (2nd ed.)", why: "Derives all of classical thermodynamics from four postulates. Best for mathematical structure and Legendre transform clarity. Can feel austere without physical grounding.",
              insecure: { advice: "If Callen's first three chapters feel abstract without physical content, read Schroeder Ch. 1–3 first. Callen's austerity makes sense once you have something to be austere about. The Legendre transform structure clicks when you see it as the math of converting between natural variables.", alt: "An Introduction to Thermal Physics — Schroeder", altWhy: "Rigetti's recommended undergraduate thermo text. Physical, warm, full of examples. Weaker on mathematical structure but stronger on intuition.", reentry: "Read Schroeder Ch. 1–3 first, then return to Callen from the beginning." } },
            { id: "r35", type: "INTUITIVE", title: "An Introduction to Thermal Physics", author: "Schroeder", why: "Rigetti's recommendation. Physical, warm, full of examples. Builds intuition before Callen's formalism.",
              insecure: { advice: "If entropy feels circular, read Jaynes' lectures alongside. Jaynes defines entropy as missing information — a definition that resolves the circularity.", alt: null, altWhy: null, reentry: "Read Schroeder Ch. 2 (second law) alongside Jaynes' lecture on entropy." } }
          ],
          spotlights: []
        },
        {
          id: "p5_s2", title: "5.2  Statistical Mechanics",
          desc: "Pathria is the graduate standard. Jaynes' lectures connect the MaxEnt principle explicitly to the Gibbs/Boltzmann distributions. Both are required.",
          resources: [
            { id: "r36", type: "PRIMARY", title: "Statistical Mechanics", author: "Pathria & Beale (4th ed.)", why: "Graduate standard. Derivations careful; grand canonical ensemble and quantum statistics chapters excellent.",
              insecure: { advice: "If Pathria's grand canonical ensemble (Ch. 4) is losing physical meaning, Huang's Statistical Mechanics covers the same material with more physical commentary.", alt: "Statistical Mechanics — Huang", altWhy: "Rigetti's recommended bridge between undergraduate and graduate stat mech.", reentry: "Read Huang Ch. 7–8 (canonical and grand canonical ensembles) before returning to Pathria Ch. 4." } },
            { id: "r37", type: "INFORMATION", title: "Statistical Mechanics — Jaynes lectures", author: "Jaynes (free online)", why: "Short lectures connecting MaxEnt explicitly to Gibbs/Boltzmann distributions. Mandatory complement.",
              insecure: { advice: "If the MaxEnt derivation feels like a trick, work through it on paper: write down Shannon entropy, apply Lagrange multipliers for the energy constraint, differentiate, set to zero. The exponential form falls out from the constraint, not from an assumption.", alt: null, altWhy: null, reentry: "Work through the MaxEnt derivation by hand before reading Pathria Ch. 3." } },
            { id: "r38", type: "APPLICATIONS*", title: "Statistical Mechanics of Phase Transitions", author: "Yeomans", why: "Renormalization group and scaling — conceptually beautiful and a direct bridge to condensed matter.",
              insecure: { advice: "The renormalization group is the deepest idea in the curriculum. If Yeomans Ch. 5 (RG) is opaque, Wilson's Nobel lecture (free online) is the best conceptual introduction. Read it first, then return.", alt: null, altWhy: null, reentry: "Read Wilson's Nobel lecture before Yeomans Ch. 5." } }
          ],
          spotlights: [
            { type: "MATH SPOTLIGHT", items: ["Partition function as a Laplace transform: thermodynamic potentials are its cumulant-generating function", "Saddle-point approximation: how thermodynamic limits suppress fluctuations", "Fluctuation-dissipation theorem: derive it from the autocorrelation function, not just state it"] },
            { type: "STAT SPOTLIGHT", items: ["Why S = −k Σ pᵢ ln pᵢ is Shannon entropy — not an analogy but an identity. Derive the equivalence.", "Equipartition as a consequence of Gaussian integrals: every quadratic DoF contributes ½kT", "Phase transitions as non-analyticities of the partition function: understand what the thermodynamic limit is doing"] }
          ]
        }
      ]
    },
    {
      id: "p6", number: "6", title: "Condensed Matter Physics",
      duration: "8–12 months", tag: "Destination", color: "#2C3E50", light: "#E8ECF0",
      intro: "Where everything converges. QM of many-body systems, statistical mechanics of interacting particles, and the geometry from Phase 2's optional layer all reappear here. The modern field is also where quantum computing hardware lives.",
      concurrent: ["p7"], concurrentNote: "Phase 6 and Phase 7 (Materials) can and should run concurrently. Phonons in Kittel and phonons in Allen & Thomas illuminate each other. Band theory maps directly to electronic properties of real materials in Phase 7.",
      sections: [
        {
          id: "p6_s1", title: "6.1  Introduction Layer",
          desc: "Kittel is the standard introduction. Simon is more modern and conceptually clearer. Work through the first 12 chapters of Kittel, using Simon to clarify what Kittel compresses.",
          resources: [
            { id: "r39", type: "PRIMARY", title: "Introduction to Solid State Physics", author: "Kittel (8th ed.)", why: "Standard introduction: crystal structure, phonons, band theory, magnetism. Work through first 12 chapters.",
              insecure: { advice: "If phonons (Ch. 4) are losing physical meaning, draw the dispersion relation ω(k) for the 1D chain and identify: (1) the acoustic branch, (2) the zone boundary, (3) why group velocity goes to zero at the boundary.", alt: "The Oxford Solid State Basics — Simon", altWhy: "More modern and conceptually clearer than Kittel; includes problem solutions.", reentry: "Read Simon Ch. 9–11 (phonons) alongside Kittel Ch. 4." } },
            { id: "r40", type: "COMPLEMENT", title: "The Oxford Solid State Basics", author: "Simon", why: "Modern, conceptually clearer, includes problem solutions. Excellent companion to Kittel.",
              insecure: { advice: "Simon's tight-binding model (Ch. 11) is the clearest treatment available. If still unclear, draw the orbital overlap diagram for each atom and trace how the band forms from discrete levels.", alt: null, altWhy: null, reentry: "Read Simon Ch. 11 before Kittel Ch. 8 (semiconductor crystals)." } }
          ],
          spotlights: []
        },
        {
          id: "p6_s2", title: "6.2  Advanced Layer",
          desc: "Ashcroft & Mermin is the definitive reference. Topology and many-body methods are optional depth — essential if heading toward topological quantum computing.",
          resources: [
            { id: "r41", type: "PRIMARY", title: "Solid State Physics", author: "Ashcroft & Mermin", why: "The definitive reference. More mathematical than Kittel. Fermi liquid and superconductivity chapters exceptional.",
              insecure: { advice: "A&M Ch. 8 (electron levels in a periodic potential) is a perturbation theory argument where the perturbation is the periodic potential. Re-read Ch. 2–3 first if Ch. 8 is unclear.", alt: null, altWhy: null, reentry: "Work A&M Ch. 2 problems before Ch. 8." } },
            { id: "r42", type: "TOPOLOGY*", title: "Topological Insulators", author: "Bernevig & Hughes", why: "Berry phase, Chern number, bulk-boundary correspondence. Requires differential forms from Phase 2 Layer 3.",
              insecure: { advice: "If the Berry phase derivation is unclear: Berry phase is the holonomy of a connection on a line bundle over parameter space. The connection is A = ⟨n|∂k|n⟩. The Chern number is the integral of its curvature.", alt: null, altWhy: null, reentry: "Read Bernevig Ch. 1 after reviewing differential forms in Baez Part I." } },
            { id: "r43", type: "MANY-BODY*", title: "A Guide to Feynman Diagrams in the Many-Body Problem", author: "Mattuck", why: "Informal, visual, and remarkably clear introduction to second quantization and Green's function methods.",
              insecure: { advice: "Mattuck is deliberately informal. Read alongside Fetter & Walecka Ch. 1–3 for the rigorous parallel treatment.", alt: null, altWhy: null, reentry: "Read Mattuck Ch. 1–3 before attempting diagrammatic perturbation theory." } }
          ],
          spotlights: [{ type: "KEY MATHEMATICAL STRUCTURES", items: ["Second quantization: creation/annihilation operators as notation for identical particles", "Bloch's theorem as a consequence of translational symmetry: band structure from representation theory", "Berry phase and holonomy: the same mathematics as parallel transport on a fiber bundle", "Renormalization group: why second-order phase transitions have universal exponents — the most profound result in the curriculum"] }]
        }
      ]
    },
    {
      id: "p7", number: "7", title: "Materials Physics",
      duration: "4–6 months", tag: "Destination", color: "#4A7C59", light: "#EAF4EE",
      intro: "Where condensed matter theory meets engineering applications. Intentionally lighter than Phase 6 — a focused survey with deeper dives in areas of interest. The characterization section (§7.4) is where Phase 3.5 signal processing pays direct dividends.",
      concurrent: ["p6"], concurrentNote: "Run concurrently with Phase 6. Phonons, band theory, and defect thermodynamics are best seen from both perspectives simultaneously. §7.4 (characterization) requires signal processing from Phase 3.5.",
      sections: [
        {
          id: "p7_s1", title: "7.1  Structural and Thermodynamic Foundations",
          desc: "Phase diagrams, crystal growth, and defect thermodynamics are the structural vocabulary underlying almost every materials property.",
          resources: [
            { id: "r44", type: "PRIMARY", title: "The Structure of Materials", author: "Allen & Thomas", why: "Rigorous treatment of crystal structures, point defects, dislocations, grain boundaries, and diffusion.",
              insecure: { advice: "If grain boundary energy (Ch. 5) is losing physical meaning, draw the dislocation model of a low-angle boundary — the energy formula follows from counting dislocations.", alt: null, altWhy: null, reentry: "Read Allen & Thomas Ch. 3 (point defects) before Ch. 5 (interfaces)." } },
            { id: "r45", type: "THERMO", title: "Introduction to the Thermodynamics of Materials", author: "Gaskell & Laughlin (6th ed.)", why: "Phase equilibria from thermodynamic principles. Connects directly to Callen's approach from Phase 5.",
              insecure: { advice: "If the common tangent construction for binary phase diagrams is unclear, re-read it as a convexity argument: phases on the common tangent have the same chemical potentials.", alt: null, altWhy: null, reentry: "Re-read Callen Ch. 7 (stability) before Gaskell Ch. 8 (binary phase diagrams)." } }
          ],
          spotlights: [{ type: "STAT SPOTLIGHT", items: ["Defect thermodynamics: vacancy concentration from G = H − TS minimization — a canonical ensemble calculation", "Phase diagrams as free energy diagrams: the common tangent construction is a convexity statement", "Spinodal decomposition: unstable to infinitesimal fluctuations when d²G/dc² < 0 — governed by Cahn-Hilliard equation"] }]
        },
        {
          id: "p7_s4", title: "7.4  Characterization Methods — Signal Analysis Applied",
          desc: "Nearly every characterization technique is a signal processing problem. This is where Phase 3.5 pays off directly.",
          resources: [
            { id: "r46", type: "REFERENCE", title: "Elements of X-Ray Diffraction", author: "Cullity & Stock (3rd ed.)", why: "Thorough derivation of Bragg's law, structure factors, diffraction methods. Draw the Phase 3.5 connections explicitly.",
              insecure: { advice: "The structure factor calculation in Ch. 4 is a Fourier transform of the unit cell contents. If unclear, re-read it after reviewing Bracewell Ch. 2 — the diffraction pattern IS the squared modulus of the FT of the electron density.", alt: null, altWhy: null, reentry: "Review Bracewell Ch. 2 before Cullity Ch. 4." } }
          ],
          spotlights: [{ type: "SIGNAL PROCESSING CONNECTIONS", items: ["XRD: diffraction pattern = |FT(electron density)|². Peak broadening = convolution with instrument response.", "TEM: image contrast determined by contrast transfer function (CTF) — a frequency-domain filter.", "FTIR: raw measurement is an interferogram = IFT(spectrum). Apply apodization windows before FT.", "Impedance spectroscopy: fit complex Z(ω) by nonlinear least squares. Kramers-Kronig relations constrain physically realizable impedance."] }]
        }
      ]
    },
    {
      id: "p8", number: "8", title: "Quantum Computing",
      duration: "6–10 months", tag: "Destination", color: "#6B3F8A", light: "#F0EAF8",
      intro: "Best approached after solid QM foundation (Phase 4). Mathematical content is linear algebra (Phase 0), density matrices and entanglement (Phase 4), and group theory. The field moves quickly — supplement textbooks with recent arXiv review papers.",
      concurrent: [], concurrentNote: null,
      sections: [
        {
          id: "p8_s1", title: "Core Resources",
          desc: "Nielsen & Chuang is the definitive text. Preskill's notes are more modern on error correction. Work both.",
          resources: [
            { id: "r47", type: "PRIMARY", title: "Quantum Computation & Quantum Information", author: "Nielsen & Chuang ('Mike and Ike')", why: "Definitive textbook. Chapters 2, 4, 10 essential. Parts I and II cover circuits, algorithms, error correction with full proofs.",
              insecure: { advice: "If Ch. 10 (error correction) is opaque, read Preskill Ch. 7 first — it is more motivated. Do not skip §2.4 (density matrices and partial trace) even if Ch. 2 feels redundant with Phase 4.", alt: "Preskill Lecture Notes Ch. 7 (quantum error correction)", altWhy: "More modern and motivated than N&C Ch. 10. Free at caltech.edu.", reentry: "Read N&C §10.1–10.3 after Preskill Ch. 7." } },
            { id: "r48", type: "LECTURES", title: "Quantum Information Lecture Notes", author: "Preskill (free, caltech.edu)", why: "More modern than Nielsen & Chuang on error correction and quantum information.",
              insecure: { advice: "Preskill's notes are lecture notes — they assume you are following along in sequence. If a chapter is unclear, re-read the previous chapter's summary section before proceeding.", alt: null, altWhy: null, reentry: "Read Preskill Ch. 2 (foundations) before Ch. 5 (quantum error correction)." } },
            { id: "r49", type: "HARDWARE*", title: "Quantum Computing: From Linear Algebra to Physical Realizations", author: "Nakahara & Ohmi", why: "Bridges to physical implementations — superconducting qubits, trapped ions. Useful given Phase 6 and 7 context.",
              insecure: { advice: "Nakahara's treatment of superconducting qubits (Ch. 15) requires Josephson junction physics. Re-read Kittel's superconductivity chapter or Tinkham Ch. 1 before attempting Ch. 15.", alt: null, altWhy: null, reentry: "Read Tinkham Introduction to Superconductivity Ch. 1 before Nakahara Ch. 15." } }
          ],
          spotlights: [
            { type: "MATH SPOTLIGHT", items: ["Tensor products of Hilbert spaces: why entanglement is not classical correlation", "Stabilizer formalism: quantum error correction codes as a group-theoretic construction", "Quantum channels and Kraus operators: open quantum systems as completely positive trace-preserving maps", "Fault-tolerance threshold theorem: understand the proof strategy — one of the deepest results in the field"] },
            { type: "MATERIALS CONNECTION", items: ["Topological qubits: Majorana fermions in topological superconductors (Phase 6+7) as a qubit platform", "Materials decoherence: T₁ and T₂ times are set by two-level system defects at oxide interfaces (Phase 7)", "Surface codes as 2D lattice physics: logical operators have topological character — a fusion of all prior phases"] }
          ]
        }
      ]
    }
  ]
};

const MATH = {
  id: "math",
  title: "Proof-Based Mathematics Supplement",
  phases: [
    {
      id: "m0", number: "T0", title: "Proof Mechanics & Mathematical Logic",
      duration: "2–3 months", tag: "Entry", color: "#3D3B8E", light: "#EEEDF8",
      intro: "Makes the implicit learning of proof technique explicit. The fastest tier — budget 2–3 months. The five proof strategies must be internalized before anything else; they reappear in every subsequent tier.",
      concurrent: ["p0"], concurrentNote: "CONCURRENT MINIMUM: All of T0.1 (Velleman/Hammack proof mechanics — 2–3 months, run fully concurrent with P0) and T0.3 (Hardy & Wright or Niven Ch. 1–2 only — divisibility, primes, FTA as proof practice). DEFER TO POST-PHYSICS: Number theory beyond Ch. 2 (analytic number theory, prime number theorem, algebraic number theory, Dirichlet L-functions). See Post-Physics Mathematics appendix.",
      sections: [
        {
          id: "m0_s1", title: "T0.1  Logic and Proof Strategy",
          desc: "The five core proof strategies must be mastered before anything else.",
          resources: [
            { id: "m_r1", type: "PRIMARY", title: "How to Prove It", author: "Velleman (3rd ed.)", why: "Canonical introduction. Sentential logic, quantifiers, sets, functions, and all standard proof strategies with exercises.",
              insecure: { advice: "If Chapter 3 (proofs) feels like a foreign language, back up to Chapter 2 (quantifiers) and work every exercise. The core difficulty is that 'for all x, there exists y' and 'there exists y, for all x' are different statements. Work 20 quantifier examples before attempting proofs.", alt: "Book of Proof — Hammack (free PDF)", altWhy: "Gentler pacing than Velleman. Legally free at richardhammack.com.", reentry: "Work Velleman Ch. 1 exercises in full before Ch. 2." } },
            { id: "m_r2", type: "SUPPLEMENT", title: "Book of Proof", author: "Hammack (free PDF)", why: "Gentler pacing than Velleman. Good as first contact for those who find Velleman immediately opaque.",
              insecure: { advice: "If Hammack also feels unclear, the issue is likely comfort with mathematical notation (∀, ∃, ∈, ⊂). Spend one session writing every symbol, its English meaning, and three examples before reading further.", alt: null, altWhy: null, reentry: "Work Hammack Ch. 1 (sets and notation) before Chapter 4 (direct proofs)." } }
          ],
          spotlights: [{ type: "FIVE CORE STRATEGIES", items: ["DIRECT: Assume hypothesis, derive conclusion. Used when the path is visible.", "CONTRADICTION: Assume ¬(conclusion), derive a contradiction. Used when the direct path is blocked.", "CONTRAPOSITIVE: Prove ¬Q → ¬P instead of P → Q (logically equivalent). Often cleaner.", "INDUCTION: Prove base case + inductive step. Know weak vs. strong induction.", "EXISTENCE & UNIQUENESS: Construct the object; then assume two exist and show they are equal."] }]
        },
        {
          id: "m0_s3", title: "T0.3  Number Theory as Proof Practice",
          desc: "The best low-stakes proof practice ground for T0 concurrent use: Hardy & Wright or Niven Ch. 1–2 only. These two chapters provide rich proof practice (divisibility, primes, FTA) with zero physics prerequisite. Advanced number theory beyond Ch. 2 — analytic number theory, prime number theorem, algebraic number theory, Dirichlet L-functions — is a post-physics pure math topic. See the Post-Physics Mathematics appendix.",
          resources: [
            { id: "m_r4", type: "OPTION A", title: "An Introduction to the Theory of Numbers", author: "Niven, Zuckerman & Montgomery (Ch. 1–2)", why: "Modern, efficient. Chapters 1–2 cover divisibility and primes with clean proofs. Good for rapid proof practice.",
              insecure: { advice: "If the unique factorization proof (FTA) is unclear, re-read the proof that every integer > 1 has a prime factor first (simpler induction). The FTA proof is two separate inductions — existence and uniqueness — applied in sequence.", alt: "An Introduction to the Theory of Numbers — Hardy & Wright (6th ed.)", altWhy: "Tomforde's stronger recommendation. Richer, more classical, historically deep.", reentry: "Work Niven Ch. 1 problems 1–15 before Ch. 2." } },
            { id: "m_r5", type: "OPTION B ★", title: "An Introduction to the Theory of Numbers", author: "Hardy & Wright (6th ed.)", why: "Tomforde and most mathematicians rate this above Niven. Richer historical context, more classical proofs. Hardy & Wright gives four different proofs of the infinitude of primes — a lesson in how proof strategies illuminate the same result.",
              insecure: { advice: "Hardy & Wright is denser than Niven. If it stalls, read Silverman's 'A Friendly Introduction to Number Theory' for an even gentler on-ramp. Then return to H&W.", alt: "A Friendly Introduction to Number Theory — Silverman", altWhy: "Most accessible of the number theory texts. Good if both Niven and H&W feel dense.", reentry: "Read H&W Ch. 1–2 before attempting the prime number theorem discussion in Ch. 22." } }
          ],
          spotlights: [{ type: "TARGET THEOREMS", items: ["Infinitude of primes — Euclid's proof (Hardy & Wright gives 4 variants: study the differences)", "Fundamental Theorem of Arithmetic — two separate inductions: existence and uniqueness", "Euclidean algorithm terminates — a loop invariant argument (same technique as algorithm analysis)"] }]
        }
      ]
    },
    {
      id: "m1", number: "T1", title: "The Bridge: Spivak's Calculus",
      duration: "6–9 months", tag: "Core", color: "#1B5E20", light: "#EDF7EE",
      intro: "Rebuilds calculus you already know operationally, from precise definitions, with full proofs. The experience is deliberately disorienting: you know how to compute limits and derivatives, but you discover you do not know what they are. This disorientation is productive.",
      concurrent: ["p0", "p1"], concurrentNote: "Run alongside Physics Phases 0 and 1. Directly concurrent chapters: Ch. 1–8 (ε–δ limits, continuity, three hard theorems, completeness — these directly support the abstract vector space language of Axler and the completeness requirement for Hilbert spaces in QM) and Ch. 13–15 (Riemann integral, Fundamental Theorem — prerequisite for Lebesgue theory). Ch. 22–23 (infinite series, power series) are useful for QM perturbation theory but can be read concurrently with Phase 4 rather than Phase 0. The later analysis chapters (Ch. 24–30) are genuinely advanced and can be deferred to the post-physics pure math program without any physics cost.",
      sections: [
        {
          id: "m1_s1", title: "T1.1  Spivak's Calculus — Chapter Guide",
          desc: "Work every problem in Chapters 1–5. The problems are the curriculum.",
          resources: [
            { id: "m_r6", type: "PRIMARY", title: "Calculus", author: "Spivak (4th ed.)", why: "Chapters 1–8 form the core. Work every problem in Ch. 1–5. Problems are the curriculum.",
              insecure: { advice: "If Chapter 5 (ε–δ limits) is a wall, follow this four-step method: (1) Read the definition three times, drawing the picture each time. (2) Verify for f(x) = 2x at x = 3 with concrete numbers. (3) Do scratch work backwards from |f(x)−L| < ε to find δ. (4) Write the formal proof. Repeat for 5 different functions before moving on.", alt: "Elementary Analysis: The Theory of Calculus — Ross", altWhy: "Tomforde-listed: gentler than Spivak but more rigorous than a standard calculus text. More worked examples.", reentry: "Work Ross Ch. 2 (limits) with all examples before returning to Spivak Ch. 5." } },
            { id: "m_r7", type: "COMPANION", title: "Spivak Solutions Manual", author: "Meng (unofficial, freely available)", why: "Use only after genuine effort. Treat as a consultant, not a crutch.",
              insecure: { advice: "If solutions are consulted too early, set a hard timer: 45 minutes minimum before looking at any solution. After reading a solution, close it and re-derive from memory the following day.", alt: null, altWhy: null, reentry: "After reading a solution, rework the problem from scratch the next day without notes." } }
          ],
          spotlights: [{ type: "CHAPTER PRIORITY GUIDE", items: ["CH. 1–2 — Field axioms and induction. Work all problems. Foundation for everything.", "CH. 5 ★ — ε–δ limits. The hardest conceptual shift. Spend as long as needed — weeks if necessary.", "CH. 6–7 — Continuity and three hard theorems. Each uses completeness essentially.", "CH. 8 — Least upper bounds. The completeness axiom formally. Now you see why Ch. 1–7 built toward this.", "CH. 13–15 — Riemann integral as upper/lower sums. Fundamental Theorem is a theorem, not a definition.", "CH. 22–23 — Infinite series and power series. Needed for Fourier analysis and QM perturbation theory."] }]
        },
        {
          id: "m1_s3", title: "T1.3  Mathematical Writing",
          desc: "Alongside Spivak, read one short guide on mathematical writing.",
          resources: [
            { id: "m_r9", type: "SHORT READ", title: "How to Write Mathematics", author: "Halmos (~30 pages)", why: "Paul Halmos is one of the finest mathematical writers of the 20th century. Brief, opinionated, immediately useful.",
              insecure: { advice: "Take one of your Spivak proofs and revise it applying each of Halmos's rules in sequence. The difference before and after is the lesson.", alt: "Mathematical Writing — Knuth, Larrabee & Roberts (free, Stanford)", altWhy: "Longer reference; covers notation, proof style, and clarity in more detail.", reentry: "Re-read Halmos after writing 10 Spivak proofs." } }
          ],
          spotlights: []
        }
      ]
    },
    {
      id: "m2", number: "T2", title: "Real Analysis",
      duration: "6–9 months", tag: "Core", color: "#8B1A1A", light: "#FAF0F0",
      intro: "Spivak lives on the real line. Real analysis moves to metric spaces — the abstraction of distance that unifies analysis on ℝ, ℝⁿ, and function spaces (where quantum mechanics lives). Completing this tier means functional analysis for QM is within reach.",
      concurrent: ["p2", "p3"], concurrentNote: "CONCURRENT MINIMUM with P2–3: Abbott (full) + Rudin Ch. 1–7 (metric spaces, convergence, continuity, integration) + S&S Vol. 1 (Fourier — directly supports E&M and QM) + S&S Vol. 2 (Complex — contour integration is required physics technique). DEFER TO P4 CONCURRENT: S&S Vol. 3 (Lebesgue measure and Hilbert spaces — needed before T3 functional analysis but not before Phase 4). DEFER TO POST-PHYSICS: S&S Vol. 4 (Functional Analysis, Sobolev spaces, distributions) unless heading toward rigorous QFT. See Post-Physics Mathematics appendix.",
      sections: [
        {
          id: "m2_s0", title: "T2.0  Alternative Integrated Spine: Stein & Shakarchi",
          desc: "Tomforde highly recommends the Princeton Lectures in Analysis — they treat Fourier, complex, real, and functional analysis as one integrated subject. Best for readers who prefer one coherent source.",
          resources: [
            { id: "m_r10", type: "VOLUME 1 ★", title: "Fourier Analysis: An Introduction", author: "Stein & Shakarchi (Princeton Lectures Vol. 1)", why: "Rigorous Fourier series and transforms with proofs. Most physics-facing of the four volumes. Directly relevant to QM and PDEs.",
              insecure: { advice: "If Chapter 3 (convergence of Fourier series) is unclear, the core issue is Dirichlet kernel behavior. Draw the Dirichlet kernel Dₙ(x) for several values of n and observe: it peaks at x=0, the peak grows, and the width shrinks. Gibbs phenomenon follows.", alt: null, altWhy: null, reentry: "Read S&S Vol. 1 Ch. 1–2 before attempting the convergence chapter." } },
            { id: "m_r11", type: "VOLUME 2", title: "Complex Analysis", author: "Stein & Shakarchi (Princeton Lectures Vol. 2)", why: "More rigorous than Churchill; covers all of what Needham gives geometrically but analytically.",
              insecure: { advice: "S&S Vol. 2 is more demanding than Needham. If it stalls, re-read Needham's corresponding chapter for geometric intuition, then return to S&S for the analytic proof.", alt: null, altWhy: null, reentry: "Pair each S&S Vol. 2 chapter with the corresponding Needham chapter." } },
            { id: "m_r12", type: "VOLUME 3", title: "Real Analysis: Measure Theory, Integration, Hilbert Spaces", author: "Stein & Shakarchi (Princeton Lectures Vol. 3)", why: "Lebesgue integration and Hilbert spaces in one volume. Replaces both Bartle and Kreyszig if you prefer a single source.",
              insecure: { advice: "Keep asking: what problem does Lebesgue integration solve? Answer: Riemann-non-integrable functions that appear as limits of nice functions. The dominated convergence theorem is the payoff.", alt: "The Elements of Integration and Lebesgue Measure — Bartle", altWhy: "Shortest rigorous Lebesgue introduction available. More accessible than S&S Vol. 3.", reentry: "Read Bartle Ch. 1–3 before attempting S&S Vol. 3 Ch. 1." } },
            { id: "m_r13", type: "DEFER TO POST-PHYSICS", title: "Functional Analysis", author: "Stein & Shakarchi (Princeton Lectures Vol. 4)", why: "Distributions, Sobolev spaces, spectral theory. Graduate-level. Optional unless heading toward rigorous QFT.",
              insecure: { advice: "Vol. 4 is genuinely graduate-level. Spend at least 6 months with the first three volumes before attempting it.", alt: null, altWhy: null, reentry: "Complete S&S Vol. 1–3 before Vol. 4." } }
          ],
          spotlights: [{ type: "INTEGRATED VS. MODULAR PATH", items: ["MODULAR (default): Abbott → Rudin → Bartle → Kreyszig. Best if you prefer each topic's best book independently.", "INTEGRATED (Stein-Shakarchi): Volumes 1–3. Best if you prefer one coherent narrative with Fourier analysis as the spine.", "COMPROMISE: Use S&S Vol. 1 (Fourier) alongside Abbott — adds exactly what Abbott underemphasizes for physics."] }]
        },
        {
          id: "m2_s1", title: "T2.1  Analysis on ℝ — The Modular Path",
          desc: "Abbott first, then Rudin. Abbott covers the same ground with more motivation. Rudin's compression becomes a pleasure once you have Abbott's scaffolding.",
          resources: [
            { id: "m_r14", type: "PRIMARY", title: "Understanding Analysis", author: "Abbott (2nd ed.)", why: "Best bridge from Spivak to Rudin. Full motivation for sequences, series, continuity, differentiation, integration.",
              insecure: { advice: "If the chapter on sequences of functions (Ch. 6) is the breaking point — use this test: can you swap limit and integral? Uniform convergence says yes; pointwise says maybe not.", alt: "Real Mathematical Analysis — Pugh", altWhy: "Tomforde-listed: friendlier than Rudin with better pictures and a Lebesgue chapter.", reentry: "Re-read Abbott Ch. 4 (functional limits) before Ch. 6 (sequences of functions)." } },
            { id: "m_r15", type: "FOLLOW-ON", title: "Principles of Mathematical Analysis", author: "Rudin ('Baby Rudin', 3rd ed.)", why: "'Baby Rudin.' Read Ch. 1–7 after Abbott. Terse but elegant — now you can appreciate the compression.",
              insecure: { advice: "If Rudin Ch. 2 (basic topology) is a wall, re-read Abbott Ch. 3 first. Abbott's treatment is less general but clearer. Then return to Rudin knowing what he is doing.", alt: "Real Mathematical Analysis — Pugh", altWhy: "Friendlier than Rudin, better pictures.", reentry: "Complete Abbott Ch. 1–6 before opening Rudin." } }
          ],
          spotlights: [{ type: "PHYSICS PAYOFFS", items: ["Cauchy sequences → Hilbert space completeness: same property that defines the function space of QM", "Uniform convergence → Fourier series validity: allows interchange of limit and integral", "Metric spaces → Hilbert spaces: completeness in an abstract metric space is the key structural requirement"] }]
        }
      ]
    },
    {
      id: "m3", number: "T3", title: "Linear Algebra — Rigorously Revisited",
      duration: "4–6 months", tag: "Core", color: "#3D3B8E", light: "#EEEDF8",
      intro: "Axler again, this time proving the spectral theorem yourself before reading his proof. Then Kreyszig's functional analysis — the infinite-dimensional extension that is the mathematical home of quantum mechanics.",
      concurrent: ["p4"], concurrentNote: "CONCURRENT MINIMUM with P4: Axler re-read (prove spectral theorem) + Kreyszig Ch. 1–4 (normed, Banach, and Hilbert spaces). These are the direct mathematical foundation for QM observables. OPTIONAL / POST-PHYSICS: Halmos is more elegant on dual spaces and tensor products but adds little over Axler at this stage. S&S Vol. 3 (Lebesgue), if deferred from T2, belongs here as the concrete model for Kreyszig’s L² spaces.",
      sections: [
        {
          id: "m3_s1", title: "T3.1  Abstract Vector Spaces — Proving the Theorems",
          desc: "Re-read Axler proof-by-proof. Attempt every theorem proof before reading Axler's. The gap between your attempt and his is the learning.",
          resources: [
            { id: "m_r16", type: "PRIMARY", title: "Linear Algebra Done Right — proof-focused re-read", author: "Axler (4th ed.)", why: "This time: prove every theorem in Ch. 1–7 yourself before reading Axler's proof.",
              insecure: { advice: "If the spectral theorem proof (Ch. 7) is unclear, break it into three lemmas: (1) normal operators have eigenvectors, (2) eigenvectors for distinct eigenvalues are orthogonal, (3) the space has an orthonormal basis of eigenvectors. Prove each separately.", alt: "Finite-Dimensional Vector Spaces — Halmos", altWhy: "More elegant dual space and tensor product sections.", reentry: "Attempt each theorem from Ch. 1–6 before reading Ch. 7." } },
            { id: "m_r17", type: "OPTIONAL — POST-PHYSICS", title: "Finite-Dimensional Vector Spaces", author: "Halmos", why: "More elegant in places; dual space and tensor product sections are superior to most competitors.",
              insecure: { advice: "Halmos is dense but never padded. If a proof is unclear, it is because a prior definition was not fully absorbed. Go back to the last definition before the proof.", alt: null, altWhy: null, reentry: "Read Halmos after completing Axler through Ch. 7." } }
          ],
          spotlights: [{ type: "SELF-PROVE BEFORE READING", items: ["Every spanning set contains a basis; every linearly independent set extends to a basis", "All bases have the same cardinality (well-definedness of dimension)", "rank(T) + nullity(T) = dim(V) — rank-nullity theorem", "Every operator on a complex finite-dimensional space has an eigenvalue", "Spectral theorem: normal operators are unitarily diagonalizable"] }]
        },
        {
          id: "m3_s2", title: "T3.2  Functional Analysis: A First Look",
          desc: "Linear algebra in infinite dimensions — the natural home of quantum mechanics.",
          resources: [
            { id: "m_r18", type: "GENTLE INTRO", title: "Introductory Functional Analysis with Applications", author: "Kreyszig (Ch. 1–4)", why: "Best first book in functional analysis. Chapters 1–4 cover normed, Banach, and Hilbert spaces with spectral theory of bounded operators.",
              insecure: { advice: "If Banach space axioms (Ch. 2) feel abstract, re-read asking: what makes ℝⁿ special? Answer: it's complete. A Banach space is just that abstracted. A Hilbert space adds an inner product.", alt: "A Course in Functional Analysis — Conway", altWhy: "Tomforde-listed: standard graduate functional analysis. More rigorous than Kreyszig but significantly harder.", reentry: "Read Kreyszig Ch. 1 (metric spaces) before Ch. 2 (normed spaces)." } }
          ],
          spotlights: [{ type: "PHYSICS PAYOFF", items: ["Hilbert space defined: a complete inner product space. L²(ℝ) — wavefunctions — lives here.", "Bounded vs. unbounded operators: position and momentum in QM are unbounded — not defined on all of L².", "Compact operators and their spectra: the spectral theorem for compact self-adjoint operators is what Sturm–Liouville theory is an instance of."] }]
        }
      ]
    },
    {
      id: "m4", number: "T4", title: "Multivariable Analysis & Topology",
      duration: "4–6 months", tag: "Advanced", color: "#7A5C00", light: "#FFF8E7",
      intro: "Spivak's Calculus on Manifolds proves the generalized Stokes' theorem — which subsumes the divergence theorem and Green's theorem from E&M — in full generality. Topology provides the language for condensed matter's topological phases.",
      concurrent: ["p5", "p6"], concurrentNote: "CONCURRENT MINIMUM with P5–6: Spivak Calculus on Manifolds (differential forms and generalized Stokes’ theorem — required for Maxwell in differential form and Berry phase) + Munkres Part I Ch. 1–4 (topological spaces, connectedness, compactness). CONCURRENT WITH P6 (secondary): Hatcher Ch. 1 (fundamental groups and homotopy — needed for vortex winding numbers). Hatcher Ch. 2–3 (homology, cohomology) can be deferred to post-physics or read selectively.",
      sections: [
        {
          id: "m4_s1", title: "T4.1  Calculus on Manifolds — Spivak",
          desc: "Only 140 pages. Proves: inverse and implicit function theorems, integration on chains, differential forms, and the generalized Stokes' theorem. Dense — budget one month per chapter.",
          resources: [
            { id: "m_r19", type: "PRIMARY", title: "Calculus on Manifolds", author: "Spivak", why: "Proves generalized Stokes' theorem in 140 pages. Dense but complete.",
              insecure: { advice: "If the definition of a differential form (Ch. 4) is unclear: a k-form at a point is an alternating multilinear map from k tangent vectors to ℝ. A differential form is a smoothly varying choice of k-form at each point. Draw this for a 1-form (= a field of covectors) first.", alt: "Analysis on Manifolds — Munkres", altWhy: "Longer, more gentle treatment of the same material. Inverse function theorem proof is clearer than Spivak's.", reentry: "Read Munkres Ch. 1–3 before attempting Spivak Ch. 3 (integration on chains)." } },
            { id: "m_r20", type: "COMPANION", title: "Analysis on Manifolds", author: "Munkres", why: "Longer, more gentle treatment. Read side-by-side with Spivak.",
              insecure: { advice: "Use Munkres for the sections where Spivak is most compressed — they cover exactly the same content.", alt: null, altWhy: null, reentry: "Read Munkres alongside Spivak, chapter by chapter." } }
          ],
          spotlights: [{ type: "WHAT STOKES' THEOREM GIVES YOU", items: ["∫_∂M ω = ∫_M dω subsumes: FTC, Green's theorem, classical Stokes, divergence theorem — all one statement", "Maxwell's equations as dF = 0 and d*F = J — two applications of Stokes' theorem in differential form language", "de Rham cohomology: which closed forms are exact? Foundation of gauge theory."] }]
        },
        {
          id: "m4_s2", title: "T4.2  Point-Set Topology",
          desc: "The mathematics of nearness without requiring a metric. The language of topological phases of matter.",
          resources: [
            { id: "m_r21", type: "PRIMARY", title: "Topology", author: "Munkres (2nd ed., Part I, Ch. 1–4)", why: "Part I covers topological spaces, connectedness, compactness, separation axioms. The clearest exposition available.",
              insecure: { advice: "If compactness (Ch. 3) is unclear: internalize why 'every open cover has a finite subcover' is the right generalization of 'closed and bounded.' Work through the Heine-Borel theorem proof until you see how closed and bounded gives the finite subcover.", alt: "Introduction to Topology — Gamelin & Greene", altWhy: "Shorter, more computational. Good for building intuition alongside Munkres.", reentry: "Read Munkres Ch. 2 completely before Ch. 3 (connectedness and compactness)." } }
          ],
          spotlights: [{ type: "PHYSICS CONNECTIONS", items: ["Brillouin zone compactness: k-space in condensed matter is a compact torus — topological invariants exist because of this compactness", "Homotopy groups: π₁(S¹) = ℤ explains why vortices in 2D superfluids are stable — a winding number cannot be continuously unwound", "Fiber bundles: the natural language for gauge fields and Berry phase"] }]
        }
      ]
    },
    {
      id: "m5", number: "T5", title: "Abstract Algebra for Physicists",
      duration: "3–5 months", tag: "Advanced", color: "#2C3E50", light: "#E8ECF0",
      intro: "The language of symmetry in physics. Conservation laws, particle classification, crystal structure, and quantum error correction all speak this language. This tier covers only the subset relevant to physics.",
      concurrent: ["p6", "p8"], concurrentNote: "CONCURRENT MINIMUM with P6–8: Artin Ch. 1–7 (groups, rings, field extensions, matrix groups) + Serre (character theory and representations — directly needed for crystal symmetry and quantum numbers). DEFER TO POST-PHYSICS: Dummit & Foote and Lang are reference texts — encyclopedic coverage not needed during the physics program. Use D&F as a lookup reference during T5 rather than reading linearly. See Post-Physics Mathematics appendix.",
      sections: [
        {
          id: "m5_s1", title: "T5.1  Groups and Their Representations",
          desc: "Artin for groups with geometric flavor. Serre for representations. Sternberg for the physics connection.",
          resources: [
            { id: "m_r22", type: "PRIMARY", title: "Algebra", author: "Artin (2nd ed., Ch. 1–7)", why: "Group theory with strong geometric flavor. Matrix groups from the start. Tomforde-recommended.",
              insecure: { advice: "If the isomorphism theorems (Ch. 2) feel abstract, work through each one with G = ℤ₁₂, a specific subgroup, and trace the quotient construction explicitly. The theorem statements become obvious after one concrete case.", alt: "Abstract Algebra — Dummit & Foote (Ch. 1–6)", altWhy: "Tomforde's graduate algebra recommendation. More comprehensive than Artin but heavier.", reentry: "Work Artin Ch. 2 exercises with G = S₃ (symmetric group on 3 elements) before general theorems." } },
            { id: "m_r23", type: "REP THEORY", title: "Linear Representations of Finite Groups", author: "Serre", why: "Compact, rigorous, complete. Character theory chapter essential for crystal symmetries and particle physics.",
              insecure: { advice: "Core formula to internalize: orthogonality relation — the characters of irreducible representations are orthonormal. Work through it for S₃ (three irreps) before attempting anything more general.", alt: null, altWhy: null, reentry: "Read Serre Ch. 1 (representations) before Ch. 2 (characters)." } },
            { id: "m_r24", type: "PHYSICS BRIDGE", title: "Group Theory and Physics", author: "Sternberg", why: "Applies algebra to QM, crystal field theory, and the Standard Model. Read after Artin.",
              insecure: { advice: "Sternberg assumes graduate physics. Read it after Phase 4 (QM) and alongside Phase 6 (condensed matter) for maximum payoff.", alt: "Group Theory in a Nutshell for Physicists — Zee", altWhy: "Rigetti's recommendation: accessible, entertaining, covers the physics applications well.", reentry: "Read Sternberg Ch. 1 after completing Artin Ch. 1–3." } }
          ],
          spotlights: [{ type: "PHYSICS PAYOFFS", items: ["Schur's lemma: irreducible representations commute only with scalars — explains why quantum numbers label states", "SU(2) and spin: half-integer spin is resolved by the double cover SO(3) → SU(2)", "Stabilizer formalism: quantum error correction codes are group-theoretic constructions (Phase 8)"] }]
        }
      ]
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const STATUS = {
  incomplete: { label: "Not Started", icon: "○", color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" },
  complete:   { label: "Complete",    icon: "✓", color: "#15803D", bg: "#F0FDF4", border: "#86EFAC" },
  insecure:   { label: "Insecure",    icon: "⚑", color: "#B45309", bg: "#FFFBEB", border: "#FCD34D" },
};

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "curriculum_progress_v1";

async function loadProgress() {
  try {
    // Use localStorage for Android/web compatibility (window.storage is Claude-artifact-only)
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* silent fail */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getAllPhases() {
  return [
    ...PHYSICS.phases.map(p => ({ ...p, curriculum: "physics" })),
    ...MATH.phases.map(p => ({ ...p, curriculum: "math" })),
  ];
}

function getPhaseById(id) {
  return getAllPhases().find(p => p.id === id);
}

// Returns all phases that should be shown as concurrent for a given phase.
// Combines the phase's own concurrent list WITH any other phase that lists this phase.
function getConcurrentPhases(phase) {
  const all = getAllPhases();
  const ids = new Set(phase.concurrent || []);
  // Reverse lookup: find phases that list this phase in their concurrent array
  for (const other of all) {
    if (other.id !== phase.id && (other.concurrent || []).includes(phase.id)) {
      ids.add(other.id);
    }
  }
  return [...ids].map(id => all.find(p => p.id === id)).filter(Boolean);
}

// Returns the best concurrentNote for a phase (own note, or the note from a referencing phase)
function getConcurrentNote(phase) {
  if (phase.concurrentNote) return phase.concurrentNote;
  const all = getAllPhases();
  for (const other of all) {
    if (other.id !== phase.id && (other.concurrent || []).includes(phase.id) && other.concurrentNote) {
      return other.concurrentNote;
    }
  }
  return null;
}

function normalizeSearch(str) {
  // Lowercase + strip diacritics so Roman alphabet matches accented/special chars
  // e.g. "Schrodinger" matches "Schrödinger", "Poincare" matches "Poincaré"
  if (!str) return "";
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // strip combining diacritical marks
    .replace(/[^a-z0-9\s]/g, " ")       // collapse remaining special chars to space
    .replace(/\s+/g, " ")
    .trim();
}

function searchCurriculum(query) {
  if (!query || query.trim().length < 2) return [];
  const q = normalizeSearch(query);
  const results = [];

  for (const phase of getAllPhases()) {
    const phaseLabel = (phase.curriculum === "physics" ? "Phase" : "Tier") + " " + phase.number;

    // Search sections
    for (const section of phase.sections) {
      // Search resources
      for (const resource of section.resources) {
        const fields = [
          resource.title, resource.author, resource.why, resource.type,
          resource.insecure && resource.insecure.advice,
          resource.insecure && resource.insecure.alt,
          resource.insecure && resource.insecure.altWhy,
        ].filter(Boolean).join(" ");
        const rawFields = [resource.title, resource.author, resource.why, resource.type, resource.insecure && resource.insecure.advice, resource.insecure && resource.insecure.alt, resource.insecure && resource.insecure.altWhy].filter(Boolean).join(" ");
        const fields = normalizeSearch(rawFields);

        if (fields.includes(q)) {
          let snippet = resource.why;
          if (normalizeSearch(resource.title).includes(q)) snippet = resource.why;
          else if (normalizeSearch(resource.author || "").includes(q)) snippet = resource.author;
          else if (resource.insecure && resource.insecure.alt && normalizeSearch(resource.insecure.alt).includes(q)) snippet = "Alt: " + resource.insecure.alt;

          results.push({
            id: `${phase.id}_${resource.id}`,
            phaseId: phase.id,
            phaseLabel,
            phaseTitle: phase.title,
            phaseColor: phase.color,
            kind: "resource",
            type: resource.type,
            title: resource.title,
            subtitle: resource.author || "",
            snippet,
            resourceId: resource.id,
          });
        }
      }

      // Search spotlights
      for (const spotlight of section.spotlights) {
        for (const item of spotlight.items) {
          if (normalizeSearch(item).includes(q)) {
            results.push({
              id: `${phase.id}_spot_${item.slice(0, 20)}`,
              phaseId: phase.id,
              phaseLabel,
              phaseTitle: phase.title,
              phaseColor: phase.color,
              kind: "spotlight",
              type: spotlight.type,
              title: item,
              subtitle: section.title,
              snippet: null,
              resourceId: null,
            });
          }
        }
      }
    }
  }

  return results.slice(0, 20);
}

function countPhaseResources(phase) {
  let total = 0;
  for (const section of phase.sections) {
    total += section.resources.length;
  }
  return total;
}

function countCompletedResources(phase, progress) {
  let done = 0;
  for (const section of phase.sections) {
    for (const r of section.resources) {
      const st = progress[r.id];
      if (st === "complete" || st === "insecure") done++;
    }
  }
  return done;
}

function spotlightColor(type) {
  if (type.includes("STAT")) return { bg: "#FFF8E1", border: "#F59E0B", text: "#92400E" };
  if (type.includes("MATH")) return { bg: "#E6F4F4", border: "#0D9488", text: "#134E4A" };
  if (type.includes("KEY") || type.includes("CHAPTER") || type.includes("FIVE") || type.includes("TARGET") || type.includes("WHAT") || type.includes("SELF") || type.includes("INTEGRAT") || type.includes("PHYSICS") || type.includes("SIGNAL") || type.includes("MATERIALS")) return { bg: "#F5F3FF", border: "#7C3AED", text: "#4C1D95" };
  return { bg: "#F0F9FF", border: "#0284C7", text: "#0C4A6E" };
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH BAR  (popout triggered by icon button)
// ─────────────────────────────────────────────────────────────────────────────

function highlightMatch(text, query) {
  if (!query || !text) return text;
  var idx = normalizeSearch(text).indexOf(normalizeSearch(query));
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "#FEF08A", color: "#713F12", borderRadius: 2, padding: "0 1px" }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function SearchBar({ onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef   = useRef(null);
  const panelRef   = useRef(null);

  useEffect(function() {
    if (expanded) {
      setTimeout(function() { if (inputRef.current) inputRef.current.focus(); }, 60);
    } else {
      setQuery(""); setResults([]);
    }
  }, [expanded]);

  useEffect(function() {
    if (query.trim().length >= 2) {
      setResults(searchCurriculum(query));
      setSelectedIdx(-1);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(function() {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setExpanded(false);
      }
    }
    if (expanded) document.addEventListener("mousedown", handleClick);
    return function() { document.removeEventListener("mousedown", handleClick); };
  }, [expanded]);

  function handleKeyDown(e) {
    if (e.key === "Escape") { setExpanded(false); return; }
    if (results.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(function(i) { return Math.min(i + 1, results.length - 1); }); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(function(i) { return Math.max(i - 1, -1); }); }
    else if (e.key === "Enter" && selectedIdx >= 0) {
      e.preventDefault();
      var r = results[selectedIdx];
      onNavigate(r.phaseId, r.resourceId);
      setExpanded(false);
    }
  }

  function handleSelect(result) {
    onNavigate(result.phaseId, result.resourceId);
    setExpanded(false);
  }

  return (
    <div ref={panelRef} style={{ position: "relative", flexShrink: 0 }}>
      {/* Icon button */}
      <button
        onClick={function() { setExpanded(function(v) { return !v; }); }}
        style={{
          background: expanded ? "#EEF2FF" : "none",
          border: "1.5px solid " + (expanded ? "#6366F1" : "#E5E7EB"),
          borderRadius: 7, cursor: "pointer",
          color: expanded ? "#6366F1" : "#6B7280",
          fontSize: 15, padding: "4px 8px", lineHeight: 1,
          fontFamily: "inherit", transition: "all 0.15s",
        }}
        title="Search"
      >&#128269;</button>

      {/* Popout panel */}
      {expanded && (
        <div style={{
          position: "fixed",
          top: 48, right: 16,
          width: 420, maxWidth: "calc(100vw - 32px)",
          background: "white",
          border: "1.5px solid #E5E7EB",
          borderRadius: 12,
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
          zIndex: 300,
          overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: "1px solid #F3F4F6" }}>
            <span style={{ color: "#9CA3AF", fontSize: 15, flexShrink: 0 }}>&#128269;</span>
            <input
              ref={inputRef}
              value={query}
              onChange={function(e) { setQuery(e.target.value); }}
              onKeyDown={handleKeyDown}
              placeholder="Search resources, authors, topics..."
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#1F2937", fontFamily: "inherit" }}
            />
            {query && (
              <button onClick={function() { setQuery(""); if (inputRef.current) inputRef.current.focus(); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 18, padding: 0, lineHeight: 1 }}>
                &#215;
              </button>
            )}
            <button onClick={function() { setExpanded(false); }}
              style={{ background: "none", border: "1px solid #E5E7EB", cursor: "pointer", color: "#9CA3AF", fontSize: 11, padding: "2px 6px", borderRadius: 4, fontFamily: "inherit" }}>
              Esc
            </button>
          </div>

          {results.length > 0 && (
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {results.map(function(r, i) {
                return (
                  <div key={r.id}
                    onMouseDown={function() { handleSelect(r); }}
                    onMouseEnter={function() { setSelectedIdx(i); }}
                    style={{ padding: "10px 14px", cursor: "pointer",
                             background: i === selectedIdx ? "#F5F3FF" : "transparent",
                             borderBottom: i < results.length - 1 ? "1px solid #F9FAFB" : "none" }}>
                    <div style={{ display: "flex", gap: 5, marginBottom: 3 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "white", background: r.phaseColor, borderRadius: 4, padding: "1px 6px", flexShrink: 0, textTransform: "uppercase" }}>
                        {r.phaseLabel}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", background: "#F3F4F6", borderRadius: 4, padding: "1px 6px", flexShrink: 0 }}>
                        {r.type}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{highlightMatch(r.title, query)}</div>
                    {r.subtitle && <div style={{ fontSize: 12, color: "#6B7280", marginTop: 1 }}>{highlightMatch(r.subtitle, query)}</div>}
                    {r.snippet && <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3, lineHeight: 1.5, fontStyle: "italic" }}>{highlightMatch(r.snippet, query)}</div>}
                  </div>
                );
              })}
              <div style={{ padding: "7px 14px", fontSize: 11, color: "#9CA3AF", borderTop: "1px solid #F3F4F6" }}>
                {results.length} result{results.length !== 1 ? "s" : ""} · &#8593;&#8595; navigate · Enter to open · Esc to close
              </div>
            </div>
          )}
          {results.length === 0 && query.trim().length >= 2 && (
            <div style={{ padding: "20px 14px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No results for "{query}"</div>
          )}
          {query.trim().length < 2 && (
            <div style={{ padding: "16px 14px", color: "#9CA3AF", fontSize: 12, textAlign: "center" }}>Type at least 2 characters to search</div>
          )}
        </div>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function ProgressBar({ value, max, color, hideCount }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: "#E5E7EB", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.3s ease" }} />
      </div>
      {!hideCount && <span style={{ fontSize: 11, color: "#9CA3AF", minWidth: 36, textAlign: "right" }}>{value}/{max}</span>}
    </div>
  );
}

function StatusToggle({ resourceId, progress, onUpdate }) {
  const current = progress[resourceId] || "incomplete";
  const statuses = ["incomplete", "complete", "insecure"];
  const next = () => {
    const i = statuses.indexOf(current);
    return statuses[(i + 1) % statuses.length];
  };

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {statuses.map(s => {
        const cfg = STATUS[s];
        const active = current === s;
        return (
          <button
            key={s}
            onClick={() => onUpdate(resourceId, s)}
            style={{
              padding: "3px 8px",
              borderRadius: 6,
              border: `1.5px solid ${active ? cfg.border : "#E5E7EB"}`,
              background: active ? cfg.bg : "white",
              color: active ? cfg.color : "#9CA3AF",
              fontSize: 11,
              fontWeight: active ? 600 : 400,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 3,
              transition: "all 0.15s",
            }}
          >
            <span>{cfg.icon}</span>
            <span style={{ display: window.innerWidth < 480 ? "none" : "inline" }}>{cfg.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function InsecurePanel({ insecure }) {
  if (!insecure) return null;
  return (
    <div style={{
      marginTop: 10,
      padding: "12px 14px",
      background: "#FFFBEB",
      border: "1.5px solid #FCD34D",
      borderRadius: 8,
      fontSize: 13,
    }}>
      <div style={{ fontWeight: 700, color: "#92400E", marginBottom: 6, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>⚑ Insecure — Suggested Path</div>
      <p style={{ color: "#78350F", margin: "0 0 8px", lineHeight: 1.55 }}>{insecure.advice}</p>
      {insecure.alt && (
        <div style={{ marginTop: 8, padding: "8px 10px", background: "rgba(251,191,36,0.12)", borderRadius: 6 }}>
          <div style={{ fontWeight: 600, color: "#92400E", fontSize: 12 }}>Alternative Text</div>
          <div style={{ color: "#78350F", marginTop: 3 }}><strong>{insecure.alt}</strong>{insecure.altWhy ? ` — ${insecure.altWhy}` : ""}</div>
        </div>
      )}
      {insecure.reentry && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#A16207", fontStyle: "italic" }}>
          ↩ Re-entry point: {insecure.reentry}
        </div>
      )}
    </div>
  );
}

function ResourceCard({ resource, progress, onUpdate, highlighted }) {
  const status = progress[resource.id] || "incomplete";
  const cfg = STATUS[status];
  const showInsecure = status === "insecure" && resource.insecure;
  const cardRef = useRef(null);

  // Scroll into view and pulse when highlighted
  useEffect(() => {
    if (highlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlighted]);

  const typeColors = {
    PRIMARY: "#1D4ED8", "PRIMARY (re-read)": "#1D4ED8",
    SUPPLEMENT: "#6B7280", COMPLEMENT: "#6B7280", COMPANION: "#6B7280",
    OPTIONAL: "#6B7280", "MATH DEPTH*": "#6B7280", "PATH INTEGRALS*": "#6B7280",
    "VOLUME 1 ★": "#059669", "VOLUME 2": "#059669", "VOLUME 3": "#059669", "VOLUME 4*": "#9CA3AF",
    PROBLEMS: "#7C3AED", MATH: "#0891B2", PHYSICS: "#0891B2", "PHYSICS BRIDGE": "#0891B2",
    BAYESIAN: "#BE185D", DEEPER: "#BE185D", INFORMATION: "#BE185D",
    AXIOMATIC: "#1D4ED8", INTUITIVE: "#6B7280",
    PRECURSOR: "#9333EA", "OPTION A": "#0891B2", "OPTION B ★": "#D97706",
    LECTURES: "#0891B2", "HARDWARE*": "#6B7280", "CURRENT*": "#6B7280",
    REFERENCE: "#6B7280", THERMO: "#0891B2", TOPOLOGY: "#7C3AED", NOISE: "#6B7280",
    "GENTLE INTRO": "#1D4ED8", "SHORT READ": "#6B7280", "FOLLOW-ON": "#6B7280",
    "DEPTH*": "#6B7280", "REP THEORY": "#7C3AED", "PHYSICS BRIDGE2": "#0891B2",
  };
  const typeColor = typeColors[resource.type] || "#6B7280";

  return (
    <div ref={cardRef} style={{
      padding: "12px 14px",
      background: highlighted ? "#EEF2FF" : status === "complete" ? "#F0FDF4" : status === "insecure" ? "#FFFBEB" : "white",
      border: `1.5px solid ${highlighted ? "#6366F1" : status === "complete" ? "#86EFAC" : status === "insecure" ? "#FCD34D" : "#E5E7EB"}`,
      borderRadius: 10,
      marginBottom: 8,
      transition: "all 0.3s",
      boxShadow: highlighted ? "0 0 0 3px rgba(99,102,241,0.2)" : "none",
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
              color: typeColor, textTransform: "uppercase",
              background: `${typeColor}18`, padding: "1px 6px", borderRadius: 4,
            }}>{resource.type}</span>
          </div>
          <div style={{ fontWeight: 600, color: "#111827", fontSize: 14, lineHeight: 1.3 }}>{resource.title}</div>
          <div style={{ color: "#6B7280", fontSize: 12.5, marginTop: 2 }}>{resource.author}</div>
          <div style={{ color: "#374151", fontSize: 13, marginTop: 5, lineHeight: 1.5 }}>{resource.why}</div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <StatusToggle resourceId={resource.id} progress={progress} onUpdate={onUpdate} />
        </div>
      </div>
      {showInsecure && <InsecurePanel insecure={resource.insecure} />}
    </div>
  );
}

function SpotlightCard({ spotlight }) {
  const c = spotlightColor(spotlight.type);
  return (
    <div style={{
      padding: "12px 14px",
      background: c.bg,
      border: `1.5px solid ${c.border}`,
      borderRadius: 10,
      marginBottom: 8,
    }}>
      <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: "0.05em", color: c.text, marginBottom: 8, textTransform: "uppercase" }}>
        {spotlight.type}
      </div>
      <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
        {spotlight.items.map((item, i) => (
          <li key={i} style={{ color: c.text, fontSize: 13, marginBottom: i < spotlight.items.length - 1 ? 5 : 0, lineHeight: 1.5 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// PHASE VIEW
// ─────────────────────────────────────────────────────────────────────────────

function shortSectionLabel(title) {
  var s = title.replace(/^[A-Z]?[\d.]+\s+/, "");
  s = s.split("\u2014")[0].split("\u2013")[0].trim();
  if (s.length > 20) s = s.slice(0, 19).trim() + "\u2026";
  return s || title;
}

function PhaseView({ phase, progress, onUpdate, onNavigate, highlightedResourceId,
                     onBack, canPrev, canNext, onPrev, onNext, onSearchNavigate }) {
  const [expandedSections, setExpandedSections] = useState(function() {
    var init = {};
    phase.sections.forEach(function(s) { init[s.id] = true; });
    return init;
  });
  const [navOpen, setNavOpen] = useState(true);
  const sectionRefs = useRef({});

  function scrollToSection(sectionId) {
    setExpandedSections(function(prev) { return Object.assign({}, prev, { [sectionId]: true }); });
    setTimeout(function() {
      var el = sectionRefs.current[sectionId];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  const total = countPhaseResources(phase);
  const done = countCompletedResources(phase, progress);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const concurrentPhases = getConcurrentPhases(phase);
  const concurrentNote = getConcurrentNote(phase);
  const hasConcurrent = concurrentPhases.length > 0;
  const hasSections = phase.sections.length > 1;
  const hasNav = hasSections || hasConcurrent;
  var phaseLabel = (phase.curriculum === "physics" ? "Phase" : "Tier") + " " + phase.number;

  return (
    <div>
      {/* ── Unified sticky header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "linear-gradient(160deg, " + phase.light + " 0%, white 100%)",
        borderBottom: "3px solid " + phase.color,
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}>

        {/* Row 1: back | spacer | search icon | prev/next */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 12px",
          borderBottom: "1px solid " + phase.color + "30",
        }}>
          <button onClick={onBack}
            style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer",
                     color: "#6B7280", fontSize: 11, padding: "3px 5px", borderRadius: 4,
                     fontFamily: "inherit", whiteSpace: "nowrap" }}>
            &#8592; Overview
          </button>
          <div style={{ flex: 1 }} />
          <SearchBar onNavigate={onSearchNavigate} />
          <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
            <button disabled={!canPrev} onClick={onPrev}
              style={{ padding: "3px 8px", borderRadius: 5, border: "1.5px solid #E5E7EB",
                       background: "white", cursor: canPrev ? "pointer" : "not-allowed",
                       color: canPrev ? "#374151" : "#D1D5DB", fontSize: 11, fontFamily: "inherit" }}>&#8592;</button>
            <button disabled={!canNext} onClick={onNext}
              style={{ padding: "3px 8px", borderRadius: 5, border: "1.5px solid #E5E7EB",
                       background: "white", cursor: canNext ? "pointer" : "not-allowed",
                       color: canNext ? "#374151" : "#D1D5DB", fontSize: 11, fontFamily: "inherit" }}>&#8594;</button>
          </div>
        </div>

        {/* Row 2: tag | title | duration | toggle */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 14px",
          boxSizing: "border-box", overflow: "hidden",
          borderBottom: (hasNav && navOpen) ? "1px solid " + phase.color + "30" : "none",
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", color: phase.color,
                         textTransform: "uppercase", background: phase.color + "18",
                         padding: "1px 6px", borderRadius: 4, flexShrink: 0 }}>{phase.tag}</span>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827",
                       letterSpacing: "-0.01em", flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            {phaseLabel}: {phase.title}
          </h2>
          {hasNav && (
            <button
              onClick={function() { setNavOpen(function(v) { return !v; }); }}
              style={{ flexShrink: 0, background: "none", border: "1.5px solid " + phase.color + "50",
                       borderRadius: 5, cursor: "pointer", color: phase.color,
                       fontSize: 10, padding: "2px 7px", fontFamily: "inherit", fontWeight: 700 }}>
              {navOpen ? "▲" : "▼"}
            </button>
          )}
        </div>

        {/* Row 3: single horizontally-scrollable nav strip */}
        {hasNav && navOpen && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "6px 14px 8px",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}>
            {hasSections && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                <span style={{ fontSize: 9, color: "#6B7280", fontWeight: 700,
                               textTransform: "uppercase", letterSpacing: "0.07em",
                               flexShrink: 0, whiteSpace: "nowrap" }}>Sections</span>
                {phase.sections.map(function(section) {
                  return (
                    <button key={section.id}
                      onClick={function() { scrollToSection(section.id); }}
                      style={{ padding: "2px 9px", borderRadius: 20, whiteSpace: "nowrap",
                               border: "1.5px solid " + phase.color + "55",
                               background: phase.color + "0d", color: phase.color,
                               fontSize: 10, fontWeight: 600, cursor: "pointer",
                               fontFamily: "inherit", flexShrink: 0 }}>
                      {shortSectionLabel(section.title)}
                    </button>
                  );
                })}
              </div>
            )}
            {hasSections && hasConcurrent && (
              <span style={{ color: "#D1D5DB", flexShrink: 0, fontSize: 14 }}>|</span>
            )}
            {hasConcurrent && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                <span style={{ fontSize: 9, color: "#7C3AED", fontWeight: 700,
                               textTransform: "uppercase", letterSpacing: "0.07em",
                               flexShrink: 0, whiteSpace: "nowrap" }}>Concurrent</span>
                {concurrentPhases.map(function(p) {
                  var lbl = (p.curriculum === "physics" ? "Ph." : "T") + p.number + " " + p.title;
                  if (lbl.length > 24) lbl = lbl.slice(0, 23) + "\u2026";
                  return (
                    <button key={p.id}
                      onClick={function() { onNavigate(p.id); }}
                      style={{ padding: "2px 9px", borderRadius: 20, whiteSpace: "nowrap",
                               border: "1.5px solid " + p.color + "55",
                               background: p.color + "0d", color: p.color,
                               fontSize: 10, fontWeight: 600, cursor: "pointer",
                               fontFamily: "inherit", flexShrink: 0 }}>
                      {lbl} {"\u2192"}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Intro + concurrent note ── */}
      <div style={{ padding: "16px 20px 10px" }}>
        <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.6 }}>{phase.intro}</p>
        {hasConcurrent && concurrentNote && (
          <p style={{ margin: "12px 0 0", fontSize: 13, color: "#5B21B6", lineHeight: 1.6,
                      background: "#F5F3FF", border: "1px solid #DDD6FE",
                      borderRadius: 8, padding: "10px 14px" }}>
            <strong style={{ color: "#7C3AED" }}>Concurrent study:</strong> {concurrentNote}
          </p>
        )}
      </div>

      {/* ── Sections ── */}
      {phase.sections.map(function(section) {
        return (
          <div key={section.id}
               ref={function(el) { sectionRefs.current[section.id] = el; }}
               style={{ marginBottom: 24 }}>
            <button
              onClick={function() { setExpandedSections(function(prev) {
                var next = Object.assign({}, prev);
                next[section.id] = !prev[section.id];
                return next;
              }); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10,
                       padding: "10px 16px", background: "#F9FAFB", border: "1.5px solid #E5E7EB",
                       borderRadius: expandedSections[section.id] ? "10px 10px 0 0" : 10,
                       cursor: "pointer", textAlign: "left" }}>
              <span style={{ color: phase.color, fontWeight: 700, fontSize: 13, flex: 1 }}>{section.title}</span>
              <span style={{ color: "#9CA3AF", fontSize: 14 }}>{expandedSections[section.id] ? "▲" : "▼"}</span>
            </button>
            {expandedSections[section.id] && (
              <div style={{ padding: "14px 16px", border: "1.5px solid #E5E7EB",
                            borderTop: "none", borderRadius: "0 0 10px 10px", background: "white" }}>
                {section.desc && (
                  <p style={{ margin: "0 0 14px", color: "#4B5563", fontSize: 13.5, lineHeight: 1.6 }}>{section.desc}</p>
                )}
                {section.resources.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    {section.resources.map(function(r) {
                      return <ResourceCard key={r.id} resource={r} progress={progress} onUpdate={onUpdate} highlighted={highlightedResourceId === r.id} />;
                    })}
                  </div>
                )}
                {section.spotlights && section.spotlights.map(function(s, i) {
                  return <SpotlightCard key={i} spotlight={s} />;
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* spacer so content isn't hidden behind sticky footer */}
      <div style={{ height: 64 }} />

      {/* ── Sticky progress footer ── */}
      <div style={{
        position: "sticky", bottom: 0, zIndex: 8,
        background: "white",
        borderTop: "2px solid " + phase.color,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.07)",
        padding: "8px 16px",
        display: "flex", alignItems: "center", gap: 12,
        boxSizing: "border-box",
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: phase.color, flexShrink: 0,
                       textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {phaseLabel}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ProgressBar value={done} max={total} color={phase.color} hideCount />
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", flexShrink: 0, whiteSpace: "nowrap" }}>
          {done}/{total} ({pct}%)
        </span>
        <span style={{ fontSize: 10, color: "#9CA3AF", flexShrink: 0, whiteSpace: "nowrap",
                       borderLeft: "1px solid #E5E7EB", paddingLeft: 10 }}>
          {phase.duration}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────

function SidebarPhaseRow({ phase, active, progress, onClick }) {
  const total = countPhaseResources(phase);
  const done = countCompletedResources(phase, progress);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", textAlign: "left",
        padding: "9px 14px",
        background: active ? `${phase.color}18` : "transparent",
        border: "none",
        borderLeft: `3px solid ${active ? phase.color : "transparent"}`,
        cursor: "pointer",
        display: "flex", flexDirection: "column", gap: 4,
        transition: "all 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: active ? 700 : 500, color: active ? phase.color : "#374151", fontSize: 13 }}>
          {phase.curriculum === "physics" ? `Ph. ${phase.number}` : `T${phase.number}`} · {phase.title}
        </span>
        {pct === 100 && <span style={{ color: "#15803D", fontSize: 11 }}>✓</span>}
        {pct > 0 && pct < 100 && <span style={{ color: "#9CA3AF", fontSize: 11 }}>{pct}%</span>}
      </div>
      {(active || pct > 0) && (
        <div style={{ height: 3, background: "#E5E7EB", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: phase.color, borderRadius: 99 }} />
        </div>
      )}
    </button>
  );
}

function Sidebar({ activePhaseId, progress, onSelect, onSelectAppendix, collapsed, onToggle }) {
  const allPhases = getAllPhases();
  const physicsPhases = allPhases.filter(p => p.curriculum === "physics");
  const mathPhases = allPhases.filter(p => p.curriculum === "math");

  // Overall stats
  const totalAll = allPhases.reduce((s, p) => s + countPhaseResources(p), 0);
  const doneAll = allPhases.reduce((s, p) => s + countCompletedResources(p, progress), 0);

  return (
    <div style={{
      width: collapsed ? 48 : 260,
      flexShrink: 0,
      background: "#FAFAFA",
      borderRight: "1.5px solid #E5E7EB",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.2s ease",
      overflow: "hidden",
      height: "100vh",
      position: "sticky",
      top: 0,
    }}>
      {/* Logo row */}
      <div style={{
        padding: "14px 14px 12px",
        borderBottom: "1.5px solid #E5E7EB",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, color: "#111827", letterSpacing: "-0.01em" }}>Physics & Math</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>Self-Study Curriculum</div>
          </div>
        )}
        <button onClick={onToggle} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 18, padding: 2 }}>
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Overall progress */}
          <div style={{ padding: "10px 14px", borderBottom: "1.5px solid #E5E7EB", flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>Overall Progress</div>
            <ProgressBar value={doneAll} max={totalAll} color="#4F46E5" />
          </div>

          {/* Nav */}
          <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}>
            <div style={{ padding: "8px 14px 4px", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "#9CA3AF", textTransform: "uppercase" }}>
              Physics Curriculum
            </div>
            {physicsPhases.map(p => (
              <SidebarPhaseRow
                key={p.id}
                phase={p}
                active={p.id === activePhaseId}
                progress={progress}
                onClick={() => onSelect(p.id)}
              />
            ))}

            <div style={{ padding: "12px 14px 4px", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "#9CA3AF", textTransform: "uppercase", marginTop: 8 }}>
              Math Supplement
            </div>
            {mathPhases.map(p => (
              <SidebarPhaseRow
                key={p.id}
                phase={p}
                active={p.id === activePhaseId}
                progress={progress}
                onClick={() => onSelect(p.id)}
              />
            ))}

            <div style={{ padding: "16px 14px 4px", borderTop: "1.5px solid #E5E7EB", marginTop: 8 }}>
              <button
                onClick={onSelectAppendix}
                style={{ width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 7,
                         background: activePhaseId === "appendix" ? "#F0EAF8" : "transparent",
                         border: "none", cursor: "pointer", fontFamily: "inherit",
                         borderLeft: "3px solid " + (activePhaseId === "appendix" ? "#6B3F8A" : "transparent"),
                }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6B3F8A", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  &#128218; Appendix
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>Alternative &amp; reference texts</div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERVIEW PANEL
// ─────────────────────────────────────────────────────────────────────────────

function Overview({ progress, onSelect }) {
  const allPhases = getAllPhases();
  const totalAll = allPhases.reduce((s, p) => s + countPhaseResources(p), 0);
  const doneAll = allPhases.reduce((s, p) => s + countCompletedResources(p, progress), 0);
  const insecureCount = Object.values(progress).filter(v => v === "insecure").length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 4px", letterSpacing: "-0.03em" }}>
        Physics & Mathematics Self-Study
      </h1>
      <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 28px" }}>
        1–3 hrs/week · ~5–7 year arc · Destinations: condensed matter, materials physics, quantum computing
      </p>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
        {[
          { label: "Total Resources", value: totalAll, color: "#4F46E5" },
          { label: "Completed", value: doneAll, color: "#15803D" },
          { label: "Insecure", value: insecureCount, color: "#B45309" },
          { label: "Remaining", value: totalAll - doneAll, color: "#6B7280" },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: "1 1 140px",
            padding: "14px 18px",
            background: "white",
            border: "1.5px solid #E5E7EB",
            borderRadius: 12,
            borderTop: `3px solid ${stat.color}`,
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Physics phases */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 14px", letterSpacing: "-0.01em" }}>
          Physics Curriculum
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {PHYSICS.phases.map(p => {
            const total = countPhaseResources(p);
            const done = countCompletedResources(p, progress);
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                style={{
                  textAlign: "left", padding: "14px 16px",
                  background: "white", border: `1.5px solid ${p.color}40`,
                  borderRadius: 10, cursor: "pointer",
                  borderLeft: `4px solid ${p.color}`,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: "#111827", fontSize: 13 }}>Phase {p.number}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: p.color,
                    background: `${p.color}18`, padding: "1px 6px", borderRadius: 4,
                  }}>{p.tag}</span>
                </div>
                <div style={{ color: "#374151", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{p.title}</div>
                <ProgressBar value={done} max={total} color={p.color} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Math phases */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 14px", letterSpacing: "-0.01em" }}>
          Mathematics Supplement
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {MATH.phases.map(p => {
            const total = countPhaseResources(p);
            const done = countCompletedResources(p, progress);
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                style={{
                  textAlign: "left", padding: "14px 16px",
                  background: "white", border: `1.5px solid ${p.color}40`,
                  borderRadius: 10, cursor: "pointer",
                  borderLeft: `4px solid ${p.color}`,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: "#111827", fontSize: 13 }}>Tier {p.number}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: p.color,
                    background: `${p.color}18`, padding: "1px 6px", borderRadius: 4,
                  }}>{p.tag}</span>
                </div>
                <div style={{ color: "#374151", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{p.title}</div>
                <ProgressBar value={done} max={total} color={p.color} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// APPENDIX DATA
// ─────────────────────────────────────────────────────────────────────────────

const APPENDIX_SECTIONS = [
  {
    id: "app_proof", title: "Proof & Mathematical Logic",
    phaseRef: "T0", color: "#3D3B8E",
    entries: [
      { title: "Book of Proof", author: "Hammack (3rd ed.)", type: "FREE ONLINE", note: "Direct and well-paced alternative to Velleman. Freely available at bookofproof.org. Better on induction." },
      { title: "Mathematical Proofs: A Transition to Advanced Mathematics", author: "Chartrand, Polimeni & Zhang", type: "ALTERNATIVE", note: "Stronger on proof by contrapositive and mathematical writing style. More examples than Velleman." },
      { title: "An Introduction to Mathematical Reasoning", author: "Eccles", type: "ALTERNATIVE", note: "UK-style treatment, excellent on sets and relations. Good preparation for Rudin." },
    ]
  },
  {
    id: "app_calc", title: "Rigorous Calculus",
    phaseRef: "T1", color: "#1B5E20",
    entries: [
      { title: "Calculus", author: "Apostol (Vols. 1–2)", type: "ALTERNATIVE", note: "Integration-before-differentiation approach. More thorough than Spivak on linear algebra integration. Some prefer this ordering." },
      { title: "Introduction to Calculus and Analysis", author: "Courant & John", type: "CLASSIC", note: "Courant’s masterpiece. Stronger on physical intuition than Spivak. Two volumes cover single and multivariable." },
      { title: "Calculus", author: "Lang", type: "LIGHTER", note: "Shorter and less demanding than Spivak. Good bridge if Spivak feels overwhelming at first." },
    ]
  },
  {
    id: "app_analysis", title: "Real Analysis",
    phaseRef: "T2", color: "#8B1A1A",
    entries: [
      { title: "Principles of Mathematical Analysis", author: "Rudin (‘Baby Rudin’)", type: "CANONICAL", note: "The standard. Terse and demanding. Ch. 1–7 covers metric spaces, continuity, differentiation, Riemann-Stieltjes integration." },
      { title: "Real Analysis: Modern Techniques and Their Applications", author: "Folland", type: "GRADUATE", note: "Covers Lebesgue measure, L^p spaces, and Fourier analysis properly. The bridge to functional analysis needed for QM." },
      { title: "Real Analysis", author: "Royden & Fitzpatrick", type: "ALTERNATIVE", note: "More accessible than Folland for Lebesgue theory. Widely used in first-year graduate courses." },
      { title: "Real Mathematical Analysis", author: "Pugh", type: "GENTLER RUDIN", note: "Covers the same ground as Rudin with more pictures and motivation. Many find this the right introduction before attempting Rudin." },
    ]
  },
  {
    id: "app_linalg", title: "Linear Algebra (Rigorous)",
    phaseRef: "T3 / P0", color: "#3D3B8E",
    entries: [
      { title: "Linear Algebra Done Right", author: "Axler (4th ed.)", type: "PRIMARY ALT", note: "Determinant-free approach until late. Eigenvalues via minimal polynomial. Cleaner for physics applications than most." },
      { title: "Finite-Dimensional Vector Spaces", author: "Halmos", type: "CLASSIC", note: "Elegant, concise, proof-oriented. Spectral theorem treatment is superb. Good second reading after Axler." },
      { title: "Matrix Analysis", author: "Horn & Johnson", type: "REFERENCE", note: "The definitive reference for matrix theory. Too dense for linear study but invaluable as a reference for singular values, norms, and spectral theory." },
      { title: "Introduction to Linear Algebra", author: "Strang (5th ed.)", type: "COMPUTATIONAL", note: "Best computational intuition. Excellent for understanding SVD, PCA, and Fourier as linear algebra. Less proof-focused." },
    ]
  },
  {
    id: "app_ode", title: "ODEs & PDEs",
    phaseRef: "P0", color: "#1A7A7A",
    entries: [
      { title: "Ordinary Differential Equations", author: "Tenenbaum & Pollard", type: "PRIMARY ALT", note: "Encyclopedic, inexpensive Dover edition. Best reference for technique-level mastery." },
      { title: "Differential Equations with Applications and Historical Notes", author: "Simmons", type: "READABLE", note: "Excellent exposition and historical context. Rigetti’s alternative recommendation for ODEs." },
      { title: "Partial Differential Equations for Scientists and Engineers", author: "Farlow", type: "ACCESSIBLE", note: "Problem-driven and clear. Good alternative to Strauss when physical motivation is lacking." },
      { title: "Partial Differential Equations", author: "Evans", type: "GRADUATE", note: "The graduate PDE standard. Relevant only if pursuing rigorous mathematical physics beyond the curriculum scope." },
      { title: "Mathematical Physics", author: "Boas (3rd ed.)", type: "REFERENCE", note: "Comprehensive methods reference covering series, complex analysis, ODEs, PDEs, and tensors. Good supplement throughout Phases 0–2." },
    ]
  },
  {
    id: "app_cm", title: "Classical Mechanics",
    phaseRef: "P1", color: "#4A6FA5",
    entries: [
      { title: "Classical Mechanics", author: "Taylor", type: "ACCESSIBLE", note: "More readable than Goldstein with excellent problems. Rigetti’s recommended on-ramp. Less depth on canonical transformations." },
      { title: "Classical Mechanics", author: "Morin", type: "PROBLEMS", note: "Problem-focused. Famous for difficulty. Good supplement to Goldstein if the problems feel too sparse." },
      { title: "Mechanics", author: "Landau & Lifshitz Vol. 1", type: "TERSE CLASSIC", note: "Every sentence is load-bearing. Problems are inseparable from text. Required reading for its variational-principle-first approach." },
      { title: "Mathematical Methods of Classical Mechanics", author: "Arnold", type: "GEOMETRIC", note: "Symplectic geometry as the natural language of mechanics. Read after Goldstein if you want the mathematical structure." },
      { title: "Structure and Interpretation of Classical Mechanics", author: "Sussman & Wisdom", type: "COMPUTATIONAL", note: "Free online (MIT). Lagrangian mechanics via Scheme programs. Forces explicit thinking about coordinate freedom." },
    ]
  },
  {
    id: "app_em", title: "Electromagnetism",
    phaseRef: "P2", color: "#B8860B",
    entries: [
      { title: "Electricity and Magnetism", author: "Purcell & Morin (3rd ed.)", type: "PHYSICAL INTUITION", note: "Derives magnetism from SR. Best physical foundation. SI edition with Morin’s additional problems." },
      { title: "Classical Electrodynamics", author: "Jackson (3rd ed.)", type: "GRADUATE STANDARD", note: "The graduate reference. Dense and comprehensive. Problems are notorious but transformative. Chapter 6 (scattering) and Ch. 11 (special relativity) are superb." },
      { title: "Modern Electrodynamics", author: "Zangwill", type: "GRADUATE ALTERNATIVE", note: "More modern and readable than Jackson with better organization. Good Jackson alternative for self-study." },
      { title: "A Student’s Guide to Maxwell’s Equations", author: "Fleisch", type: "COMPANION", note: "Each Maxwell equation unpacked completely. Ideal supplement when Griffiths’ explanations are insufficient." },
      { title: "Classical Electromagnetic Radiation", author: "Heald & Marion", type: "RADIATION", note: "Best dedicated treatment of electromagnetic radiation and scattering. Fills gap in Griffiths." },
    ]
  },
  {
    id: "app_waves", title: "Waves & Optics",
    phaseRef: "P3", color: "#7B4F9E",
    entries: [
      { title: "Optics", author: "Hecht (5th ed.)", type: "COMPREHENSIVE", note: "Rigetti’s recommended optics text. Beautiful figures, comprehensive coverage of physical optics, laser optics, and Fourier methods." },
      { title: "Introduction to Modern Optics", author: "Fowles", type: "CONCISE", note: "Dover edition. Shorter than Hecht, strong on coherence and laser physics. Better mathematical development of Fresnel/Fraunhofer diffraction." },
      { title: "Waves", author: "Crawford (Berkeley Physics Vol. 3)", type: "PHYSICAL", note: "Physical derivations and excellent problems. The Berkeley series is consistently underrated." },
      { title: "The Fourier Transform and Its Applications", author: "Bracewell", type: "MATH", note: "The standard reference for Fourier methods in signal processing and physics. Convolution, sampling theorem, 2D transforms." },
    ]
  },
  {
    id: "app_qm", title: "Quantum Mechanics",
    phaseRef: "P4", color: "#1A7A7A",
    entries: [
      { title: "Principles of Quantum Mechanics", author: "Shankar (2nd ed.)", type: "PRIMARY", note: "Best for self-study. Mathematical prerequisites developed in Part I. Dirac notation from page 1. Path integral in Ch. 8." },
      { title: "Modern Quantum Mechanics", author: "Sakurai & Napolitano (3rd ed.)", type: "GRADUATE STANDARD", note: "Spin-first approach. Better than Shankar on angular momentum, perturbation theory, and scattering. Essential second text." },
      { title: "Quantum Mechanics", author: "Cohen-Tannoudji, Diu & Laloë (2 vols.)", type: "COMPREHENSIVE", note: "Two-volume encyclopedia. Complements contain solved problems at every chapter. Best reference for specific calculations." },
      { title: "Quantum Mechanics and Path Integrals", author: "Feynman & Hibbs", type: "PATH INTEGRAL", note: "Original path integral formulation. Feynman’s physical intuition is unmatched. Complement to the operator formalism." },
      { title: "Quantum Mechanics: The Theoretical Minimum", author: "Susskind & Friedman", type: "ENTRY POINT", note: "Accessible bridge from classical mechanics to QM. Good for restoring intuition if Shankar feels abstract." },
      { title: "Lectures on Quantum Mechanics", author: "Weinberg", type: "ADVANCED", note: "Weinberg’s perspective on foundations, measurement, and quantum field theory connections. For deep reading after primary texts." },
    ]
  },
  {
    id: "app_sm", title: "Statistical Mechanics & Thermodynamics",
    phaseRef: "P5", color: "#B8860B",
    entries: [
      { title: "An Introduction to Thermal Physics", author: "Schroeder", type: "ENTRY", note: "Exceptionally clear. Best Ch. 1–3 for thermodynamic intuition before moving to Callen." },
      { title: "Thermodynamics and an Introduction to Thermostatistics", author: "Callen (2nd ed.)", type: "CANONICAL", note: "Axiomatic thermodynamics. Rigetti’s required text for thermodynamic structure." },
      { title: "Statistical Mechanics", author: "Pathria & Beale (3rd ed.)", type: "GRADUATE STANDARD", note: "The graduate standard. Comprehensive, formal. Chapter 3 (canonical ensemble) is the core of the curriculum." },
      { title: "Statistical Mechanics", author: "Huang", type: "ALTERNATIVE", note: "More focused on phase transitions and critical phenomena than Pathria. Good if condensed matter is the destination." },
      { title: "Statistical Mechanics: A Set of Lectures", author: "Feynman", type: "PERSPECTIVE", note: "Path integral perspective on statistical mechanics. Chapter on polaron problem is unique." },
      { title: "Statistical Mechanics", author: "Ma", type: "ADVANCED", note: "Renormalization group from a pedagogical perspective. Excellent preparation for critical phenomena in Phase 6." },
      { title: "Entropy, Order Parameters, and Complexity", author: "Sethna", type: "MODERN", note: "Free online. Modern approach emphasizing universality, information theory, and complex systems. Excellent problems." },
    ]
  },
  {
    id: "app_cm2", title: "Condensed Matter Physics",
    phaseRef: "P6", color: "#2C3E50",
    entries: [
      { title: "Introduction to Solid State Physics", author: "Kittel (8th ed.)", type: "STANDARD", note: "The undergraduate standard. Strong on crystal structure, phonons, and free electron model. Use with Simon for modern perspective." },
      { title: "The Oxford Solid State Basics", author: "Simon", type: "MODERN", note: "Rigetti’s companion to Kittel. More conceptual, cleaner notation, better on band theory and topology." },
      { title: "Solid State Physics", author: "Ashcroft & Mermin", type: "GRADUATE STANDARD", note: "The definitive graduate text. Semi-classical transport, Fermi liquid theory, superconductivity. Dense but comprehensive." },
      { title: "Condensed Matter Physics", author: "Marder (2nd ed.)", type: "MODERN ALTERNATIVE", note: "More modern than Ashcroft & Mermin. Better on semiconductors, magnetism, and surfaces. Good alternative if A&M is inaccessible." },
      { title: "Introduction to Many-Body Physics", author: "Coleman", type: "MANY-BODY", note: "Best introduction to Feynman diagrams, Green’s functions, and many-body perturbation theory in condensed matter context." },
      { title: "Topological Insulators and Topological Superconductors", author: "Bernevig & Hughes", type: "TOPOLOGY", note: "The primary reference for topological band theory. Berry phase, Chern numbers, edge states. Requires solid Phase 6 foundation." },
      { title: "A Quantum Approach to Condensed Matter Physics", author: "Taylor & Heinonen", type: "QUANTUM FIRST", note: "Second quantization and Green’s functions from the start. Bridge between QM formalism and condensed matter." },
    ]
  },
  {
    id: "app_mat", title: "Materials Physics",
    phaseRef: "P7", color: "#4A7C59",
    entries: [
      { title: "The Science and Engineering of Materials", author: "Askeland & Wright", type: "ENGINEERING", note: "More engineering-focused than Allen & Thomas. Better on processing-structure-property relationships and phase diagrams." },
      { title: "Materials Science and Engineering: An Introduction", author: "Callister & Rethwisch", type: "STANDARD", note: "The standard undergraduate materials text. Comprehensive reference. Less physics depth than Allen & Thomas." },
      { title: "Physical Ceramics", author: "Chiang, Birnie & Kingery", type: "CERAMICS", note: "Rigetti’s recommendation for ionic materials and defect chemistry. Essential for oxide electronics." },
      { title: "Defects in Crystals", author: "Hirth & Lothe", type: "DISLOCATIONS", note: "The definitive dislocation reference. Required for serious work on mechanical properties and crystal growth." },
      { title: "X-ray Diffraction", author: "Cullity & Stock", type: "CHARACTERIZATION", note: "Best self-contained XRD reference. Structure factor derivation, powder diffraction, and Rietveld method." },
    ]
  },
  {
    id: "app_qc", title: "Quantum Computing",
    phaseRef: "P8", color: "#6B3F8A",
    entries: [
      { title: "Quantum Computation and Quantum Information", author: "Nielsen & Chuang", type: "STANDARD", note: "The definitive reference. Comprehensive on algorithms, error correction, and complexity. Use Ch. 1–5 as primary curriculum." },
      { title: "Quantum Computing: An Applied Approach", author: "Hidary (2nd ed.)", type: "APPLIED", note: "Practical focus with code examples (Cirq, Qiskit). Good complement to Nielsen & Chuang for implementation context." },
      { title: "Lecture Notes on Quantum Information and Quantum Computing", author: "Preskill", type: "FREE ONLINE", note: "Preskill’s Caltech notes (theory.caltech.edu/~preskill). Deep on error correction and fault tolerance. Graduate level." },
      { title: "An Introduction to Quantum Computing", author: "Kaye, Laflamme & Mosca", type: "ACCESSIBLE", note: "Gentler introduction than Nielsen & Chuang. Good for building intuition on circuits and basic algorithms." },
      { title: "Mathematics of Quantum Computing", author: "Scherer", type: "MATH-FOCUSED", note: "Rigorous mathematical treatment emphasizing linear algebra and complexity. Good bridge from math supplement to QC." },
    ]
  },
  {
    id: "app_math_physics", title: "Mathematical Methods (Cross-Phase)",
    phaseRef: "All", color: "#374151",
    entries: [
      { title: "Mathematical Methods for Physicists", author: "Arfken, Weber & Harris (7th ed.)", type: "REFERENCE", note: "The comprehensive methods encyclopedia. Complex analysis, special functions, group theory, tensors. Best as a reference, not linear reading." },
      { title: "Mathematics for Physics", author: "Stone & Goldbart", type: "MODERN", note: "Free online. Graduate-level methods with a modern geometric perspective. Differential forms, fiber bundles, topology." },
      { title: "Geometry, Topology and Physics", author: "Nakahara", type: "GEOMETRY", note: "Differential geometry and topology for physicists. Essential for quantum field theory and topological phases." },
      { title: "Mathematical Physics", author: "Hassani", type: "COMPREHENSIVE", note: "More complete than Boas. Functional analysis, operator theory, and Hilbert spaces treated rigorously." },
      { title: "Lectures on Physics", author: "Feynman, Leighton & Sands (3 vols.)", type: "PERSPECTIVE", note: "Not a textbook to work through but an inexhaustible source of physical intuition. Read sections relevant to each phase." },
    ]
  },
  {
    id: "app_problems", title: "Problem Books & Olympiad Resources",
    phaseRef: "All", color: "#6B3F8A",
    entries: [
      { title: "Problems in General Physics", author: "Irodov", type: "PROBLEMS", note: "The standard physics problem collection. Mechanics through nuclear physics. Harder and more physical than textbook problems. Work selected sections by phase." },
      { title: "Aptitude Questions in Physics", author: "Krotov", type: "PROBLEMS", note: "Russian olympiad problems. Strong on dimensional analysis, order-of-magnitude estimates, and physical reasoning." },
      { title: "Physics Olympiad: Basic to Advanced Exercises", author: "Japanese Physics Olympiad Committee", type: "PROBLEMS", note: "Graduated difficulty. Good for testing conceptual understanding without heavy calculation." },
      { title: "200 Puzzling Physics Problems", author: "Gn\u00e4dig, Honyek & Riley", type: "PUZZLES", note: "Estimation and order-of-magnitude problems. Builds the Fermi estimation skills needed for condensed matter." },
      { title: "Problems in Mathematical Physics", author: "Lebedev, Skalskaya & Uflyand", type: "MATH PHYSICS", note: "Boundary value problems and special functions. Good supplement for Phase 0 PDEs and Phase 2 E&M." },
    ]
  },
  {
    id: "app_gre", title: "GRE Physics Subject Test",
    phaseRef: "Exam Prep", color: "#C0392B",
    entries: [
      { title: "GRE Physics Subject Test Prep Book", author: "Princeton Review", type: "TEST PREP", note: "Content review + 2 full practice tests. Covers all GRE topic areas: classical mechanics, E&M, QM, thermodynamics, lab methods, special relativity, and modern physics. Best starting point for a structured review schedule." },
      { title: "Conquering the Physics GRE", author: "Yoni Kahn & Adam Anderson (3rd ed.)", type: "TEST PREP", note: "The most highly regarded dedicated GRE Physics prep text. Written by physicists, covers every topic area with concise derivations and hundreds of practice problems organized by subject. Freely available as a PDF from the authors." },
      { title: "GRE Physics Practice Tests", author: "ETS (official)", type: "OFFICIAL", note: "ETS releases past exams periodically. The 2017 official practice test (GR1777) is freely available at ets.org. Working through all released exams under timed conditions is essential. Priority over any third-party material." },
      { title: "Schaum\u2019s Outline: College Physics", author: "Bueche & Hecht", type: "REVIEW", note: "Fast review of undergraduate physics. Useful for quickly revisiting topics that feel rusty before the exam. 900+ solved problems." },
      { title: "Physics: A Student Companion", author: "Benson", type: "REVIEW", note: "Compact formula and concept review organized by topic. Good quick-reference during final GRE prep weeks." },
    ]
  },
  {
    id: "app_online", title: "Online Lectures, Courses & Resources",
    phaseRef: "All", color: "#0369A1",
    entries: [
      { title: "MIT OpenCourseWare \u2014 8.03, 8.04, 8.05, 8.06, 8.333", author: "MIT (ocw.mit.edu)", type: "FREE ONLINE", note: "Complete lecture notes, problem sets with solutions, and exams for waves (8.03), QM I\u2013II (8.04/8.05), advanced QM (8.06), and statistical mechanics (8.333). The 8.04 Barton Zwiebach notes are particularly strong." },
      { title: "The Theoretical Minimum", author: "Leonard Susskind (theoreticalminimum.com)", type: "FREE ONLINE", note: "Full video lecture series: Classical Mechanics, Quantum Mechanics, Special Relativity, Statistical Mechanics, Cosmology, Quantum Entanglement. Susskind\u2019s pedagogical style is unmatched for restoring physical intuition. Companion books available." },
      { title: "Perimeter Institute Recorded Lectures (PIRSA)", author: "Perimeter Institute (pirsa.org)", type: "FREE ONLINE", note: "Graduate-level lectures on QFT, condensed matter, quantum information, and mathematical physics from world-class researchers. Especially strong on topological phases and quantum gravity." },
      { title: "lectures.ms / math.mit.edu \u2014 Linear Algebra (Strang 18.06)", author: "Gilbert Strang, MIT", type: "FREE ONLINE", note: "The definitive linear algebra video course. 34 lectures freely available. Essential complement to any rigorous linear algebra text. Strang\u2019s geometric intuition is irreplaceable." },
      { title: "Paul\u2019s Online Math Notes", author: "Paul Dawkins (tutorial.math.lamar.edu)", type: "FREE ONLINE", note: "Comprehensive notes on calculus, differential equations, and linear algebra. Excellent worked examples. Best free resource for technique-level review of ODEs and multivariable calculus during Phase 0." },
      { title: "3Blue1Brown \u2014 Essence of Linear Algebra / Calculus", author: "Grant Sanderson (3b1b.co)", type: "FREE ONLINE", note: "Visual intuition for linear algebra (eigenvectors, determinants, change of basis) and calculus. Not a substitute for rigor but unmatched for geometric intuition. Watch before or alongside T3." },
      { title: "PhysicsPages", author: "physicshandbook.com / physicspages.com", type: "FREE ONLINE", note: "Detailed worked solutions to problems in Griffiths, Shankar, Jackson, Pathria, and other standard texts. Useful for checking work and seeing alternative solution approaches." },
      { title: "Physics Stack Exchange", author: "physics.stackexchange.com", type: "COMMUNITY", note: "Consistently high-quality explanations of conceptual questions. Search before asking \u2014 most standard graduate-level conceptual questions are already answered with multiple approaches." },
      { title: "nLab", author: "ncatlab.org", type: "REFERENCE", note: "Category-theoretic perspective on mathematics and physics. Overkill for most of this curriculum but invaluable for understanding the algebraic structures behind quantum mechanics, topological phases, and TQFT." },
      { title: "Scholarpedia \u2014 Physics & Mathematics Articles", author: "scholarpedia.org", type: "REFERENCE", note: "Peer-reviewed encyclopedia articles written by original researchers. Exceptional for topics like dynamical systems, renormalization group, and quantum chaos where textbook treatments are incomplete." },
      { title: "arXiv.org \u2014 cond-mat, quant-ph, math-ph", author: "arxiv.org", type: "PREPRINTS", note: "Primary literature. For self-study, pedagogical review articles (especially Annual Reviews of Condensed Matter Physics) are accessible without full research context. Search for \u2018review\u2019 or \u2018lecture notes\u2019 in relevant subfields." },
      { title: "Condensed Matter Theory From a Quantum Information Perspective", author: "Nayak et al. \u2014 various lecture notes", type: "LECTURE NOTES", note: "Several excellent sets of free lecture notes bridging condensed matter and quantum information (Nayak\u2019s topological quantum computing notes; McGreevy\u2019s topological phases notes at UCSD). Google Scholar search for 'lecture notes topological phases' finds current versions." },
      { title: "Lectures on the Geometric Anatomy of Theoretical Physics", author: "Frederic Schuller (YouTube)", type: "YOUTUBE \u2605\u2605\u2605", note: "28 lectures covering the mathematical structure underlying physics: topological spaces, manifolds, vector bundles, connections, parallel transport, curvature, Lie groups, and principal fiber bundles. Schuller proves every theorem from first principles with exceptional clarity. Essential preparation for the topological material in Phase 6. Search 'Schuller Geometric Anatomy' on YouTube." },
      { title: "International Winter School on Gravity and Light (WE-Heraeus Foundation)", author: "Frederic Schuller (YouTube)", type: "YOUTUBE \u2605\u2605\u2605", note: "20 lectures on differential geometry and general relativity with the same axiomatic rigor as the Geometric Anatomy series. Covers smooth manifolds, tensor fields, connections, curvature, and the Einstein equations. Ideal companion to Carroll or Wald. Search 'International Winter School Gravity Light Schuller' on YouTube." },
      { title: "Fundamentals of Physics I & II", author: "Ramamurti Shankar, Yale Open Courses (YouTube)", type: "YOUTUBE \u2605\u2605", note: "Two full-semester courses taught by the author of the primary QM text. Physics I covers mechanics and special relativity (Phases 0-1); Physics II covers electromagnetism and quantum mechanics (Phases 2, 4). Shankar's explanations are exceptionally deliberate and clear. Search 'Shankar Yale Physics' on YouTube." },
      { title: "ICTP Postgraduate Diploma Lecture Series", author: "International Centre for Theoretical Sciences, Trieste (YouTube)", type: "YOUTUBE \u2605\u2605", note: "Full lecture courses on condensed matter physics, quantum mechanics, mathematical physics, and statistical mechanics given to international graduate students. The condensed matter and QFT series are directly curriculum-relevant. Search 'ICTP condensed matter' on YouTube." },
      { title: "Graduate Lecture Courses in Mathematics and Physics", author: "Oxford Mathematics (YouTube)", type: "YOUTUBE \u2605\u2605", note: "Full graduate courses freely available: Algebraic Topology (relevant to T4-T5), Manifolds, Quantum Field Theory, Number Theory, and more. Reflects Oxford's distinctive balance of rigor and geometric intuition. Search 'Oxford Mathematics' on YouTube." },
      { title: "MPIPKS Summer Schools and Workshops", author: "Max Planck Institute for the Physics of Complex Systems (YouTube / mpipks-dresden.mpg.de)", type: "YOUTUBE", note: "Annual summer schools with recorded lectures on topological phases, quantum chaos, many-body localization, and non-equilibrium physics. Particularly valuable for Phase 6 topological material. Search 'MPIPKS topological' or 'MPIPKS summer school' on YouTube." },
      { title: "MIT 8.04 Quantum Physics I (2016)", author: "Barton Zwiebach, MIT OpenCourseWare (YouTube)", type: "YOUTUBE \u2605\u2605", note: "The full 2016 lecture series on YouTube is among the best quantum mechanics courses available. Systematic, careful, and complete: wave-particle duality, Schrodinger equation, uncertainty principle, harmonic oscillator, hydrogen atom. Directly supports Phase 4. Full problem sets and exams at ocw.mit.edu/8.04." },
      { title: "UTokyo OCW Physics Lectures", author: "University of Tokyo Open Course Ware (YouTube / ocw.u-tokyo.ac.jp)", type: "YOUTUBE", note: "The University of Tokyo makes statistical mechanics, condensed matter, and mathematical physics lecture series available in English. Search 'UTokyo statistical mechanics' on YouTube or browse the OCW catalogue. Useful complement to Phase 5-6." },
      { title: "David Tong's Free Lecture Notes", author: "David Tong, University of Cambridge (damtp.cam.ac.uk/user/tong/teaching.html)", type: "FREE NOTES \u2605\u2605\u2605", note: "Tong's freely downloadable note sets are among the finest available anywhere: Quantum Field Theory, Statistical Field Theory, Lectures on the Quantum Hall Effect, Kinetic Theory, Electrodynamics, String Theory, and more. The Statistical Field Theory notes are the best bridge from Phase 5 to condensed matter QFT. The Quantum Hall notes are essential for Phase 6 topological material. Strongly recommended." },
      { title: "Stanford Quantum Entanglement & Additional Courses", author: "Leonard Susskind, Stanford (YouTube)", type: "YOUTUBE", note: "Beyond the Theoretical Minimum series already listed, Stanford's YouTube channel hosts courses on quantum entanglement, statistical mechanics, and special relativity with greater depth than the companion books. The quantum entanglement lectures bridge Phase 4 to Phase 8. Search 'Stanford Susskind' on YouTube." },
    ]
  },

  {
    id: "app_complex", title: "Complex Analysis",
    phaseRef: "T2 / P0", color: "#8B1A1A",
    entries: [
      { title: "Complex Variables and Applications", author: "Brown & Churchill (9th ed.)", type: "STANDARD", note: "Rigetti's choice for complex methods. Clear, well-organized, strong on contour integration and conformal mapping. Best undergraduate entry point." },
      { title: "Visual Complex Analysis", author: "Needham", type: "GEOMETRIC", note: "Tomforde recommended. Geometric and visual approach. Transforms abstract complex analysis into something you can see. Unmatched for building intuition before or alongside analytic rigor." },
      { title: "Complex Variables", author: "Fisher (Dover)", type: "FREE/CHEAP", note: "Rigetti's recommended supplement to Arfken. Dense but excellent overview of complex analysis for physicists. Dover pricing." },
      { title: "Complex Analysis", author: "Ahlfors", type: "CLASSIC GRADUATE", note: "Tomforde recommended. The standard rigorous graduate text. Geometric and analytic in equal measure. Harder than Conway but worth it for serious mathematical physics." },
      { title: "Functions of One Complex Variable I", author: "Conway", type: "GRADUATE", note: "Tomforde recommended. Clean, modern presentation of graduate complex analysis. Best proof-oriented introduction after undergraduate exposure." },
      { title: "Princeton Lectures in Analysis, Vol. 2: Complex Analysis", author: "Stein & Shakarchi", type: "SERIES", note: "Tomforde recommended. Beautiful exposition connecting complex analysis to Fourier analysis. Pairs naturally with Vols. 1 and 3 of the Princeton Lectures series." },
    ]
  },
  {
    id: "app_topology", title: "Topology (Point-Set & Algebraic)",
    phaseRef: "T4 / T5", color: "#3D3B8E",
    entries: [
      { title: "Topology", author: "Munkres (2nd ed.)", type: "STANDARD", note: "Tomforde recommended. The definitive undergraduate/graduate point-set topology text. Part I (general topology) is essential before algebraic topology or differential geometry. Problems are excellent." },
      { title: "General Topology", author: "Kelley (Dover)", type: "CLASSIC", note: "Tomforde recommended. Original intended title was 'What every young analyst should know.' Terse classic, Dover-priced. Strong on categorical and functional-analytic aspects." },
      { title: "Algebraic Topology", author: "Hatcher", type: "FREE ONLINE", note: "Tomforde recommended. The standard graduate algebraic topology text. Free PDF at pi.math.cornell.edu/~hatcher. Fundamental groups, homology, cohomology. Essential for topological phases in condensed matter." },
      { title: "Differential Forms in Algebraic Topology", author: "Bott & Tu", type: "BRIDGE", note: "Tomforde recommended. Bridges differential topology and algebraic topology using de Rham cohomology. Natural path toward Chern-Weil theory and topological insulators." },
      { title: "Differential Topology", author: "Guillemin & Pollack", type: "GRADUATE", note: "Tomforde recommended. Best introduction to smooth manifolds and transversality. More concrete than Milnor, more modern than do Carmo. Prerequisites for condensed matter topology." },
      { title: "Topology from the Differentiable Viewpoint", author: "Milnor", type: "CLASSIC SLIM", note: "Tomforde recommended. Fifty pages that changed mathematics. Brouwer fixed point theorem, degree theory, Morse theory. Irreplaceable link between analysis and topology." },
    ]
  },
  {
    id: "app_functional", title: "Functional Analysis",
    phaseRef: "T2 / T3 bridge", color: "#1B5E20",
    entries: [
      { title: "Princeton Lectures in Analysis, Vol. 4: Functional Analysis", author: "Stein & Shakarchi", type: "SERIES", note: "Tomforde recommended. Completes the four-volume series. Hilbert and Banach spaces, spectral theory, distributions. The right preparation for rigorous quantum mechanics." },
      { title: "A Course in Functional Analysis", author: "Conway (2nd ed.)", type: "GRADUATE STANDARD", note: "Tomforde recommended. The standard graduate functional analysis text. Hilbert spaces, operators, C*-algebras introduced. Essential for mathematical physics and quantum information." },
      { title: "Elementary Functional Analysis", author: "MacCluer", type: "ACCESSIBLE", note: "Tomforde recommended. More accessible than Conway. Good bridge from real analysis to operator theory. Stronger on examples and motivation than the standard texts." },
      { title: "Introduction to Topology and Modern Analysis", author: "Simmons", type: "COMBINED", note: "Tomforde recommended. Topology and functional analysis in one volume. Classic undergraduate bridge text. Very readable." },
    ]
  },
  {
    id: "app_abstract_alg", title: "Abstract Algebra",
    phaseRef: "T5", color: "#2C3E50",
    entries: [
      { title: "Abstract Algebra", author: "Dummit & Foote (3rd ed.)", type: "POST-PHYSICS REFERENCE", note: "Tomforde recommended. The comprehensive graduate standard. Groups, rings, fields, modules, Galois theory, representation theory. The reference to have. Dense but thorough." },
      { title: "Algebra", author: "Artin (2nd ed.)", type: "GEOMETRIC", note: "Tomforde recommended. Geometric approach with linear algebra and groups developed together. Strong on matrix groups and representations, making it particularly good for physics applications." },
      { title: "Topics in Algebra", author: "Herstein", type: "CLASSIC", note: "Tomforde recommended. Rigorous and elegant. Problems are famously hard. Classic alternative to Dummit & Foote for students who want a more economical treatment." },
      { title: "Group Theory in a Nutshell for Physicists", author: "Zee", type: "PHYSICS-FACING", note: "Rigetti recommended. Lie groups and representation theory for physicists. Best bridge between abstract algebra and the physics applications in QM and condensed matter." },
      { title: "Algebra", author: "Lang", type: "POST-PHYSICS REFERENCE", note: "Tomforde recommended. The reference for graduate algebra. Too terse for linear study but authoritative on every topic. Use after Dummit & Foote for deeper dives." },
    ]
  },
  {
    id: "app_gr", title: "General Relativity (Graduate Extension)",
    phaseRef: "Beyond P8", color: "#4A6FA5",
    entries: [
      { title: "Spacetime and Geometry", author: "Carroll", type: "PRIMARY", note: "Rigetti's primary GR text. Excellent introduction to differential geometry and GR in one volume. Clear prose, modern notation, good problems. The recommended starting point." },
      { title: "Gravitation", author: "Misner, Thorne & Wheeler (MTW)", type: "CLASSIC REFERENCE", note: "Rigetti recommended. The encyclopedic GR bible. Over 1200 pages. Best used alongside Carroll. MTW Ch. 3-4 is the best physics-context introduction to differential forms." },
      { title: "General Relativity", author: "Wald", type: "ABSTRACT/RIGOROUS", note: "Rigetti recommended. High-level and mathematically precise. Go to Carroll for intuition, Wald for the abstract structure. Spinors and quantum fields in curved spacetime are treated carefully." },
      { title: "Einstein Gravity in a Nutshell", author: "Zee", type: "ACCESSIBLE", note: "Rigetti recommended. Same accessible-overview style as QFT in a Nutshell. Good complement to Carroll for a different perspective." },
      { title: "Differential Geometry of Curves and Surfaces", author: "do Carmo (Dover)", type: "PREREQUISITE", note: "Tomforde and Rigetti recommended. Classical differential geometry as concrete prerequisite to GR formalism. Precise and beautiful. Dover priced." },
    ]
  },
  {
    id: "app_qft", title: "Quantum Field Theory (Graduate Extension)",
    phaseRef: "Beyond P8", color: "#6B3F8A",
    entries: [
      { title: "Quantum Field Theory in a Nutshell", author: "Zee (2nd ed.)", type: "ENTRY POINT", note: "Rigetti's favorite physics book. Best conceptual introduction to QFT ever written. Path integrals first. Builds intuition before formalism. Read before or alongside Peskin & Schroeder." },
      { title: "An Introduction to Quantum Field Theory", author: "Peskin & Schroeder", type: "GRADUATE STANDARD", note: "Rigetti's primary QFT text. Feynman diagrams, renormalization, gauge theories, QED, QCD. Study alongside Zee since it is too terse on its own for self-study." },
      { title: "The Quantum Theory of Fields, Vol. 1-3", author: "Weinberg", type: "ADVANCED REFERENCE", note: "Rigetti recommended. Not for first exposure but essential once Zee and Peskin are mastered. Vol. 2 (gauge theory) is the authoritative reference." },
      { title: "Quantum Field Theory and the Standard Model", author: "Schwartz", type: "MODERN ALTERNATIVE", note: "More modern and pedagogical than Peskin & Schroeder. Better on renormalization group and collider physics. Many find this the more accessible alternative for self-study." },
      { title: "Lie Algebras in Particle Physics", author: "Georgi (2nd ed.)", type: "GROUP THEORY", note: "Rigetti recommended supplement. SU(2), SU(3), and larger groups for particle physics. Essential for understanding the Standard Model and its extensions." },
    ]
  },
  {
    id: "app_popular", title: "Popular Physics: Inspiration & Big Picture",
    phaseRef: "All", color: "#B8860B",
    entries: [
      { title: "The Feynman Lectures on Physics (3 vols.)", author: "Feynman, Leighton & Sands", type: "ESSENTIAL", note: "Rigetti essential. Free online at feynmanlectures.caltech.edu. Not a textbook to work linearly but an inexhaustible source of physical intuition. Sections become clearer as you advance through the curriculum." },
      { title: "The Character of Physical Law", author: "Feynman", type: "EASY", note: "Rigetti rated Easy. Brilliant short book on the laws of nature. Inspiration for why physics works the way it does. Read any time." },
      { title: "The First Three Minutes", author: "Weinberg", type: "EASY", note: "Rigetti rated Easy. Account of the Big Bang by one of the most brilliant physicists of the 20th century. Weinberg makes deep physics accessible." },
      { title: "Black Holes and Time Warps", author: "Kip Thorne", type: "EASY/MEDIUM", note: "Rigetti's favorite popular introduction to GR. Historically rich and physically deep. Read alongside or after Phase 3." },
      { title: "Deep Down Things", author: "Schumm", type: "DIFFICULT", note: "Rigetti rated Difficult. The best popular book on particle physics. Explains gauge theory and the Standard Model without speculation. Read while beginning Phase 8 or after." },
      { title: "The Theoretical Minimum (book series)", author: "Susskind & co-authors", type: "MEDIUM", note: "Rigetti rated Medium. Book companions to Susskind's lecture series: Classical Mechanics, Quantum Mechanics, Special Relativity volumes. Best understood around Phases 1-4." },
    ]
  },
  {
    id: "app_engineering_math", title: "Engineering Math & Early Methods",
    phaseRef: "P0 entry", color: "#1A7A7A",
    entries: [
      { title: "Advanced Engineering Mathematics", author: "Zill (6th ed.)", type: "COMPREHENSIVE", note: "Rigetti's recommended undergraduate math methods text. Linear algebra, complex analysis, real analysis, PDEs, and ODEs all in one volume. Less rigorous than proof-based texts but covers all technical tools for undergraduate physics." },
      { title: "Div, Grad, Curl and All That", author: "Schey (4th ed.)", type: "COMPANION", note: "Rigetti recommended. Short focused book on vector calculus in physical terms. Best supplement when working through Phase 2 and finding the formalism slipping away from physical meaning." },
      { title: "Fourier Series", author: "Tolstov (Dover)", type: "SUPPLEMENT", note: "Rigetti rated the best book on Fourier analysis. Rigorous treatment of Fourier series with clear proofs. Dover priced. Complements Bracewell for the mathematical underpinnings." },
      { title: "Thomas' Calculus", author: "Hass, Heil & Weir (14th ed.)", type: "CALCULUS", note: "Rigetti's recommended introductory calculus text. Works as prerequisite or quick refresher before Spivak. Clear worked examples covering single and multivariable calculus." },
      { title: "Partial Differential Equations with Fourier Series", author: "Haberman (2nd ed.)", type: "PDEs", note: "Tomforde recommended. Applied PDEs with strong Fourier series treatment. More accessible than Evans and better on physics-facing applications. Good Phase 0 supplement." },
    ]
  },
  {
    id: "app_diff_geom", title: "Differential Geometry",
    phaseRef: "T4 / P6 / GR", color: "#4A7C59",
    entries: [
      { title: "Differential Geometry of Curves and Surfaces", author: "do Carmo (Dover)", type: "ENTRY POINT", note: "Tomforde and Rigetti recommended. Classical curves and surfaces in R3 with concrete calculations. The right first exposure before abstract manifold theory. Beautiful and precise. Dover priced." },
      { title: "Calculus on Manifolds", author: "Spivak", type: "BRIDGE", note: "Already in Math Tier 4. Proves the generalized Stokes theorem in 140 pages. The minimal rigorous treatment of differential forms needed for physics. Read before Nakahara or Carroll." },
      { title: "Introduction to Smooth Manifolds", author: "Lee (2nd ed.)", type: "GRADUATE STANDARD", note: "Tomforde recommended. The definitive modern graduate text on smooth manifolds. Vector fields, differential forms, integration, Lie groups. More thorough and readable than Warner or Boothby. The reference to have." },
      { title: "An Introduction to Differentiable Manifolds and Riemannian Geometry", author: "Boothby", type: "ACCESSIBLE GRADUATE", note: "Tomforde recommended. More accessible than Lee. Covers smooth manifolds through the Hopf-Rinow theorem. Good intermediate step between do Carmo and Lee." },
      { title: "Foundations of Differentiable Manifolds and Lie Groups", author: "Warner", type: "CONCISE GRADUATE", note: "Tomforde recommended. Economical and rigorous. Covers manifolds, Lie groups, and de Rham cohomology. Harder than Lee but shorter. Good for a second reading." },
      { title: "Riemannian Geometry", author: "do Carmo", type: "RIEMANNIAN", note: "Tomforde recommended. The standard graduate Riemannian geometry text. Geodesics, curvature, Jacobi fields, comparison theorems. Essential background for GR and for the curvature language of Berry phases." },
      { title: "Geometry, Topology and Physics", author: "Nakahara (2nd ed.)", type: "PHYSICS-FACING", note: "Already referenced in cross-phase math section. Homotopy, homology, fiber bundles, connections, characteristic classes. The bridge from differential geometry to gauge theory and topological phases. Dense but comprehensive." },
      { title: "A Comprehensive Introduction to Differential Geometry (5 vols.)", author: "Spivak", type: "ENCYCLOPEDIC", note: "Tomforde recommended. Spivak's multi-volume masterwork. Vol. 1 (manifolds and vector fields) and Vol. 2 (curvature) are the most useful for physics. Each chapter opens with the historical context." },
    ]
  },
  {
    id: "app_alg_geom", title: "Algebraic Geometry",
    phaseRef: "T5 / advanced", color: "#8B1A1A",
    entries: [
      { title: "Ideals, Varieties, and Algorithms", author: "Cox, Little & O'Shea (4th ed.)", type: "ENTRY POINT", note: "Tomforde recommended. Computational algebraic geometry via Groebner bases. The most accessible introduction. Requires only linear algebra and some abstract algebra. Relevant for quantum error correction and algebraic coding theory." },
      { title: "Elementary Algebraic Geometry", author: "Hulek", type: "UNDERGRADUATE", note: "Tomforde recommended. Short and concrete. Affine and projective varieties, morphisms, dimension, smooth points. Good bridge between undergraduate abstract algebra and serious algebraic geometry." },
      { title: "Algebraic Geometry: A Problem Solving Approach", author: "Garrity et al.", type: "PROBLEM-DRIVEN", note: "Tomforde recommended. IBL-style text where the reader derives the theory through problems. Exceptional for active learners. Covers plane curves, Riemann surfaces, and projective geometry." },
      { title: "Algebraic Geometry", author: "Hartshorne", type: "GRADUATE STANDARD", note: "Tomforde recommended. The standard graduate reference. Schemes, sheaves, cohomology. Notorious for difficulty. Not needed for this physics curriculum but the destination if algebraic geometry is pursued seriously." },
      { title: "Principles of Algebraic Geometry", author: "Griffiths & Harris", type: "COMPLEX GEOMETRY", note: "Tomforde recommended. Complex algebraic geometry via differential forms and Hodge theory. More geometric and analytic than Hartshorne. Relevant for mirror symmetry and string theory geometric backgrounds." },
    ]
  },
  {
    id: "app_non_euclidean", title: "Non-Euclidean & Projective Geometry",
    phaseRef: "Background / P3", color: "#7C3AED",
    entries: [
      { title: "Geometry", author: "Brannan, Esplen & Gray (2nd ed.)", type: "COMPREHENSIVE", note: "Best single undergraduate text covering Euclidean, affine, projective, hyperbolic, and inversive geometries in a unified framework. Accessible and thorough. Good conceptual foundation before differential geometry." },
      { title: "Non-Euclidean Geometry", author: "Coxeter (6th ed.)", type: "CLASSIC", note: "The definitive classical treatment of hyperbolic and elliptic geometry. Synthetic and analytic approaches. Coxeter's geometric intuition is unparalleled. Excellent historical motivation." },
      { title: "The Four Pillars of Geometry", author: "Stillwell", type: "ACCESSIBLE", note: "Four complementary approaches to geometry: synthetic, coordinates, projective, and transformations. Short and elegant. Best for a quick structural overview before choosing a deeper text." },
      { title: "Projective Geometry", author: "Coxeter", type: "PROJECTIVE", note: "The standard text on projective geometry. Homogeneous coordinates, duality, conics, cross-ratio. Projective geometry underlies quantum state space (the projective Hilbert space) and quantum information geometry." },
      { title: "Geometry and the Imagination", author: "Hilbert & Cohn-Vossen", type: "VISUAL CLASSIC", note: "Hilbert's accessible exploration of geometry at every level: polyhedra, differential geometry, topology, projective geometry. A book to read and re-read. Physical intuition on every page." },
      { title: "Visual Complex Analysis", author: "Needham", type: "CROSSOVER", note: "Also listed under Complex Analysis. Needham's treatment of Mobius transformations, hyperbolic geometry, and Riemann surfaces is the best visual introduction to non-Euclidean geometry in a physics-adjacent context." },
    ]
  },
  {
    id: "app_discrete", title: "Discrete Mathematics & Combinatorics",
    phaseRef: "T0 / QC / Background", color: "#374151",
    entries: [
      { title: "Concrete Mathematics", author: "Graham, Knuth & Patashnik (2nd ed.)", type: "ESSENTIAL", note: "Sums, recurrences, integer functions, generating functions, discrete probability. Knuth's style is engaging and demanding. Problems range from routine to research-level. Essential for quantum algorithm complexity analysis." },
      { title: "Introduction to Graph Theory", author: "West (2nd ed.)", type: "GRAPH THEORY", note: "The standard undergraduate/graduate graph theory text. Trees, matchings, connectivity, planarity, colorings, flows. Graph-theoretic thinking is increasingly central to tensor networks and quantum error correction." },
      { title: "A Walk Through Combinatorics", author: "Bona (4th ed.)", type: "COMBINATORICS", note: "Readable and comprehensive. Covers permutations, partitions, inclusion-exclusion, generating functions, Ramsey theory, and probabilistic method. Good balance of theory and problems." },
      { title: "Combinatorics and Graph Theory", author: "Harris, Hirst & Mossinghoff (2nd ed.)", type: "COMBINED", note: "Graph theory and combinatorics in one volume. Clean proof style. Strong on extremal problems and algorithmic aspects. Good for quantum computing background." },
      { title: "The Art of Problem Solving (Vol. 1 & 2)", author: "Lehoczky & Rusczyk", type: "FOUNDATIONS", note: "Best proof-writing and mathematical reasoning foundations at the pre-college to early undergraduate level. Exceptional for rebuilding discrete math intuition before T0 if proof mechanics feel weak." },
      { title: "Introduction to the Theory of Computation", author: "Sipser (3rd ed.)", type: "COMPUTABILITY", note: "Automata, context-free languages, Turing machines, decidability, complexity (P vs NP, BQP). The standard text and the best preparation for understanding quantum computational complexity and the power of quantum algorithms." },
      { title: "Discrete Mathematics and Its Applications", author: "Rosen (8th ed.)", type: "COMPREHENSIVE", note: "The standard undergraduate discrete math reference. Logic, proofs, sets, functions, algorithms, number theory, combinatorics, graph theory, boolean algebra. Best single-volume reference for the full discrete math landscape." },
    ]
  },
  {
    id: "app_cmft", title: "Condensed Matter Field Theory (P5\u2013P6 Bridge)",
    phaseRef: "P5 / P6", color: "#1A4A6B",
    entries: [
      { title: "Why field theory for condensed matter?", author: "Overview", type: "ORIENTATION", note: "You do not need to read Peskin & Schroeder to do condensed matter physics. The relevant QFT ideas are: (1) path integrals and partition functions as the same object, (2) spontaneous symmetry breaking and Goldstone bosons (phonons, magnons, Cooper pairs), (3) effective field theories and the renormalization group (already in Phase 5), (4) second quantization in the field-theoretic language, and (5) topological field theories (Chern-Simons theory for quantum Hall, \u03b8-terms for topological insulators). This section identifies what to read and in what order." },
      { title: "Condensed Matter Field Theory", author: "Altland & Simons (2nd ed.)", type: "PRIMARY \u2605\u2605\u2605", note: "The essential bridge between graduate statistical mechanics/QM and condensed matter physics. Ch. 1\u20132 (second quantization and functional field integral) should be read at the end of Phase 5 or start of Phase 6. Ch. 3\u20134 (perturbation theory and RG) complement Phase 5's renormalization group discussion. Ch. 7 (response functions) and Ch. 9 (topology) are core Phase 6 reading. More accessible than Fradkin as an entry point." },
      { title: "Quantum Field Theory of Many-Body Systems", author: "Xiao-Gang Wen", type: "TOPOLOGICAL ORDER \u2605\u2605\u2605", note: "Wen's book is unlike any other: it develops string-net condensation, topological order, non-Abelian anyons, and edge states from first principles. Chapters 1\u20133 give an efficient review of path integrals and second quantization. The remainder is the primary source for the modern theory of topological phases and fractionalization. Read alongside Phase 6 topological insulator material." },
      { title: "Field Theories of Condensed Matter Physics", author: "Eduardo Fradkin (2nd ed.)", type: "ADVANCED", note: "More encyclopedic than Altland & Simons. Strong on lattice gauge theories, the Hubbard model, bosonization, and fractionalization. The chapters on quantum Hall effect and topological phases are thorough. Best used as a reference alongside Altland & Simons rather than as primary reading." },
      { title: "Statistical Field Theory (lecture notes)", author: "David Tong (free, damtp.cam.ac.uk)", type: "FREE NOTES \u2605\u2605\u2605", note: "Tong's ~100-page note set on statistical field theory is the best short introduction to the field-theoretic treatment of phase transitions, spontaneous symmetry breaking, Goldstone bosons, the Ising model RG, and the Kosterlitz-Thouless transition. Read after completing Phase 5's renormalization group section. Free PDF at Tong's Cambridge page." },
      { title: "Lectures on the Quantum Hall Effect (lecture notes)", author: "David Tong (free, damtp.cam.ac.uk)", type: "FREE NOTES \u2605\u2605\u2605", note: "Tong's QHE notes are the best accessible introduction to Landau levels, integer and fractional quantum Hall physics, Chern-Simons theory, and the connection to topological insulators. Essential Phase 6 reading. Read after first encountering Berry phase in Phase 6." },
      { title: "What to read from standard QFT texts for condensed matter", author: "Selective reading guide", type: "READING GUIDE", note: "From Zee (QFT in a Nutshell): Part I Ch. 1\u20134 (path integrals, Feynman diagrams, spontaneous symmetry breaking), Part V Ch. V.1\u2013V.3 (superfluids, superconductors, quantum Hall). From Peskin & Schroeder: Ch. 9 (path integrals), Ch. 11 (spontaneous symmetry breaking and Goldstone theorem). These targeted readings take 4\u20136 weeks and give the full field-theoretic vocabulary needed for Altland & Simons without requiring a full QFT course." },
      { title: "Quantum Field Theory in Condensed Matter Physics", author: "Naoto Nagaosa", type: "SUPPLEMENT", note: "Compact book covering path integrals, linear response, gauge fields, and topological terms specifically for condensed matter contexts. More accessible than Fradkin at the cost of less depth. Good for a targeted overview before Altland & Simons." },
      { title: "Particle physics concepts relevant to condensed matter", author: "Reference note", type: "CONCEPT NOTE", note: "The following particle physics concepts appear directly in condensed matter: (1) Spontaneous symmetry breaking and the Higgs mechanism \u2014 the Meissner effect in superconductors is the Higgs mechanism in a U(1) gauge theory. (2) Goldstone theorem \u2014 every broken continuous symmetry gives a massless boson: phonons (broken translation), magnons (broken rotation), Cooper pairs (broken U(1)). (3) Anomalies \u2014 chiral anomaly explains surface states of topological insulators. (4) Chern-Simons theory \u2014 the effective field theory of the quantum Hall effect. (5) theta-terms and axion electrodynamics \u2014 the electromagnetic response of topological insulators." },
    ]
  },
  {
    id: "app_post_math", title: "Post-Physics: Pure Mathematics Extensions",
    phaseRef: "After P8", color: "#4A1942",
    entries: [
      { title: "Overview: what belongs here and why", author: "Program note", type: "ORIENTATION", note: "The following mathematical topics are genuinely worth pursuing but are not on the critical path for any physics phase. Moving them post-physics serves two purposes: (1) you have more mathematical maturity and better physical intuition when you encounter them, making them more illuminating rather than just more work; (2) the physics program is not delayed waiting for pure-math prerequisites that only loosely connect to physics. The topics here are recommended in roughly the order listed." },
      { title: "Advanced Number Theory", author: "Post-physics track", type: "TRACK", note: "Prerequisites met during T0: Hardy & Wright Ch. 1\u20132 gave divisibility and primes. Post-physics sequence: (1) Hardy & Wright Ch. 5\u201310 (congruences, quadratic residues, sums of squares, continued fractions) \u2014 the richest elementary number theory; (2) Apostol's Introduction to Analytic Number Theory for Dirichlet series, the prime number theorem, and L-functions; (3) Neukirch Algebraic Number Theory for the algebraic side (ideal class groups, Dedekind domains). Connections to physics: L-functions appear in zeta function regularization in QFT; modular forms appear in string theory." },
      { title: "Measure-Theoretic Probability", author: "Post-physics track", type: "TRACK", note: "The physics program uses probability extensively (Phase 0.3 Jaynes, Phase 5 stat mech) but only requires Jaynes-style and elementary measure theory from Lebesgue integration (T2). Post-physics depth sequence: (1) Billingsley Probability and Measure \u2014 the standard rigorous text; (2) Durrett Probability: Theory and Examples \u2014 more accessible, strong on applications; (3) Revuz & Yor Continuous Martingales and Brownian Motion for stochastic calculus. Connections to physics: quantum stochastic differential equations, noise in quantum devices (Phase 8), stochastic thermodynamics." },
      { title: "Arnold: Full Symplectic Geometry Program", author: "Post-physics track", type: "TRACK", note: "Concurrent portion already identified: Arnold Ch. 1 and Ch. 3 (Lagrangian and Hamiltonian mechanics) read after T4 alongside Phase 5\u20136. Post-physics portion: Ch. 4 (variational principles), Ch. 7 (integrable systems), Ch. 8 (perturbation theory), Ch. 9 (adiabatic invariants), and the appendices on symplectic topology. Prerequisites: completed T4 (Spivak CoM + topology) and familiarity with Lee's Smooth Manifolds. Pair with Arnol'd & Avez Ergodic Problems of Classical Mechanics for the ergodic theory side." },
      { title: "Algebraic Number Theory and Arithmetic Geometry", author: "Post-physics track", type: "TRACK", note: "For those who want to go deep into the algebraic structures underlying modular forms and elliptic curves, which appear in areas of mathematical physics: (1) Serre A Course in Arithmetic \u2014 beautifully written, connects quadratic forms, p-adic numbers, and modular forms; (2) Silverman The Arithmetic of Elliptic Curves \u2014 the standard graduate text; (3) Diamond & Shurman A First Course in Modular Forms. These are pure mathematics but have connections to string compactifications and conformal field theory." },
      { title: "Ergodic Theory and Dynamical Systems", author: "Post-physics track", type: "TRACK", note: "A natural extension of Phase 5 (statistical mechanics) and Arnold's symplectic mechanics. (1) Walters An Introduction to Ergodic Theory \u2014 standard text; (2) Katok & Hasselblatt Introduction to the Modern Theory of Dynamical Systems \u2014 encyclopedic; (3) Devaney An Introduction to Chaotic Dynamical Systems for the elementary side. Directly relevant to thermalization, quantum chaos, and many-body ergodicity questions." },
      { title: "Category Theory", author: "Post-physics track", type: "TRACK", note: "Category theory provides a unifying language for many structures in this curriculum. Not on the critical path but intellectually illuminating. (1) Lawvere & Schanuel Conceptual Mathematics \u2014 the gentlest introduction; (2) Riehl Category Theory in Context \u2014 free PDF, excellent graduate introduction; (3) Mac Lane Categories for the Working Mathematician \u2014 the classic. nLab (already in online resources) is the category-theoretic perspective on physics and mathematics." },
    ]
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// APPENDIX VIEW
// ─────────────────────────────────────────────────────────────────────────────

function AppendixView({ onBack, onSearchNavigate }) {
  const [openSections, setOpenSections] = useState({});

  function toggleSection(id) {
    setOpenSections(function(prev) {
      return Object.assign({}, prev, { [id]: !prev[id] });
    });
  }

  function expandAll() {
    var all = {};
    APPENDIX_SECTIONS.forEach(function(s) { all[s.id] = true; });
    setOpenSections(all);
  }

  function collapseAll() { setOpenSections({}); }

  const TYPE_COLORS = {
    "FREE ONLINE":  { bg: "#D1FAE5", color: "#065F46" },
    "PRIMARY ALT":  { bg: "#DBEAFE", color: "#1E40AF" },
    "CANONICAL":    { bg: "#EDE9FE", color: "#5B21B6" },
    "GRADUATE STANDARD": { bg: "#FEE2E2", color: "#991B1B" },
    "GRADUATE":     { bg: "#FEE2E2", color: "#991B1B" },
    "PROBLEMS":     { bg: "#FEF3C7", color: "#92400E" },
    "REFERENCE":    { bg: "#F3F4F6", color: "#374151" },
    "ALTERNATIVE":  { bg: "#E0F2FE", color: "#0369A1" },
    "CLASSIC":      { bg: "#F5F3FF", color: "#6D28D9" },
    "STANDARD":     { bg: "#ECFDF5", color: "#065F46" },
    "COMPANION":    { bg: "#F0FDFB", color: "#0F766E" },
    "MODERN":       { bg: "#EFF6FF", color: "#1D4ED8" },
  };

  function badgeStyle(type) {
    var t = type.toUpperCase();
    var found = null;
    Object.keys(TYPE_COLORS).forEach(function(k) {
      if (!found && t.indexOf(k) !== -1) found = TYPE_COLORS[k];
    });
    return found || { bg: "#F3F4F6", color: "#374151" };
  }

  return (
    <div>
      {/* Sticky header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "linear-gradient(160deg, #F8F7FF 0%, white 100%)",
        borderBottom: "3px solid #6B3F8A",
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderBottom: "1px solid #6B3F8A30" }}>
          <button onClick={onBack}
            style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer",
                     color: "#6B7280", fontSize: 11, padding: "3px 5px", borderRadius: 4, fontFamily: "inherit" }}>
            &#8592; Overview
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={function() {
              var allOpen = APPENDIX_SECTIONS.every(function(s) { return openSections[s.id]; });
              if (allOpen) { collapseAll(); } else { expandAll(); }
            }}
            style={{ fontSize: 11, padding: "3px 9px", borderRadius: 5, border: "1.5px solid #E5E7EB",
                     background: "white", cursor: "pointer", fontFamily: "inherit", color: "#374151", flexShrink: 0 }}>
            {APPENDIX_SECTIONS.every(function(s) { return openSections[s.id]; }) ? "Collapse all" : "Expand all"}
          </button>
          <SearchBar onNavigate={onSearchNavigate} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px" }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", color: "#6B3F8A",
                         textTransform: "uppercase", background: "#6B3F8A18", padding: "1px 6px", borderRadius: 4, flexShrink: 0 }}>Appendix</span>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827", flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            Alternative Textbooks & Reference Materials
          </h2>
        </div>
      </div>

      {/* Intro */}
      <div style={{ padding: "14px 20px 10px" }}>
        <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
          Alternatives, supplements, and reference texts for each phase of the curriculum. These are not required — the main curriculum already identifies primary and optional texts.
          Use this appendix when a primary text is unavailable, when you want a different exposition, or when the primary text’s approach isn’t clicking.
        </p>
      </div>

      {/* Sections */}
      {APPENDIX_SECTIONS.map(function(section) {
        var isOpen = !!openSections[section.id];
        return (
          <div key={section.id} style={{ marginBottom: 16 }}>
            <button
              onClick={function() { toggleSection(section.id); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10,
                       padding: "10px 16px", background: "#F9FAFB", border: "1.5px solid #E5E7EB",
                       borderRadius: isOpen ? "10px 10px 0 0" : 10,
                       cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: section.color, background: section.color + "15",
                             padding: "1px 7px", borderRadius: 4, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {section.phaseRef}
              </span>
              <span style={{ color: "#111827", fontWeight: 700, fontSize: 13, flex: 1 }}>{section.title}</span>
              <span style={{ color: "#9CA3AF", fontSize: 11, flexShrink: 0 }}>{section.entries.length} texts</span>
              <span style={{ color: "#9CA3AF", fontSize: 14 }}>{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && (
              <div style={{ border: "1.5px solid #E5E7EB", borderTop: "none", borderRadius: "0 0 10px 10px", background: "white" }}>
                {section.entries.map(function(entry, i) {
                  var bs = badgeStyle(entry.type);
                  return (
                    <div key={i} style={{
                      padding: "12px 16px",
                      borderBottom: i < section.entries.length - 1 ? "1px solid #F3F4F6" : "none",
                      display: "flex", gap: 12, alignItems: "flex-start",
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{entry.title}</span>
                          <span style={{ fontSize: 11, color: "#6B7280" }}>{entry.author}</span>
                        </div>
                        <div style={{ marginBottom: 5 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 4,
                                         background: bs.bg, color: bs.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            {entry.type}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: 12.5, color: "#4B5563", lineHeight: 1.6 }}>{entry.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Footer */}
      <div style={{ margin: "8px 0 32px", padding: "14px 20px", background: "white",
                    border: "1.5px solid #E5E7EB", borderRadius: 12, fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>
        <strong style={{ color: "#374151" }}>Note on editions:</strong> Where a specific edition is listed, later editions are generally acceptable unless noted. For Dover reprints (Tenenbaum, Halmos, Fowles, etc.), any printing is equivalent. Free online texts are linked to their canonical sources where possible.
      </div>
    </div>
  );
}


export default function App() {
  const [progress, setProgress] = useState({});
  const [activePhaseId, setActivePhaseId] = useState(null); // null = overview, "appendix" = appendix
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [highlightedResourceId, setHighlightedResourceId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const mainRef = useRef(null);

  // Load persisted progress
  useEffect(() => {
    loadProgress().then(data => {
      setProgress(data);
      setLoaded(true);
    });
  }, []);

  const handleUpdate = useCallback(async (resourceId, status) => {
    setProgress(prev => {
      const next = { ...prev, [resourceId]: status };
      saveProgress(next);
      return next;
    });
  }, []);

  const handleSelect = useCallback((phaseId) => {
    setActivePhaseId(phaseId);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, []);

  const handleSearchNavigate = useCallback((phaseId, resourceId) => {
    setActivePhaseId(phaseId);
    setHighlightedResourceId(resourceId);
    if (mainRef.current) mainRef.current.scrollTop = 0;
    // Clear highlight after 3s
    setTimeout(() => setHighlightedResourceId(null), 3000);
  }, []);

  const activePhase = (activePhaseId && activePhaseId !== "appendix") ? getPhaseById(activePhaseId) : null;
  const showAppendix = activePhaseId === "appendix";
  const allPhases = getAllPhases();
  const activePhaseIdx = activePhaseId ? allPhases.findIndex(p => p.id === activePhaseId) : -1;

  if (!loaded) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#F9FAFB" }}>
        <div style={{ color: "#6B7280", fontSize: 14 }}>Loading progress…</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#F9FAFB", overflow: "hidden", minWidth: 0 }}>
      <Sidebar
        activePhaseId={activePhaseId}
        progress={progress}
        onSelect={handleSelect}
        onSelectAppendix={() => { setActivePhaseId("appendix"); if (mainRef.current) mainRef.current.scrollTop = 0; }}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
      />

      {/* Main content */}
      <div ref={mainRef} style={{ flex: 1, overflowY: "auto", background: "#F9FAFB", minWidth: 0 }}>

        {/* Overview header (only shown when no phase selected and not appendix) */}
        {!activePhase && !showAppendix && (
          <div style={{
            position: "sticky", top: 0, zIndex: 10,
            background: "rgba(249,250,251,0.97)", backdropFilter: "blur(8px)",
            borderBottom: "1.5px solid #E5E7EB",
            padding: "8px 16px",
            display: "flex", alignItems: "center", gap: 8,
            boxSizing: "border-box",
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#374151", flexShrink: 0 }}>Overview</span>
            <SearchBar onNavigate={handleSearchNavigate} />
          </div>
        )}

        {/* Content */}
        <div style={{ maxWidth: 860, margin: "0 auto", padding: activePhase ? "0 24px 0" : "8px 24px 40px" }}>
          {showAppendix ? (
            <AppendixView
              onBack={() => setActivePhaseId(null)}
              onSearchNavigate={handleSearchNavigate}
            />
          ) : activePhase ? (
            <PhaseView
              key={activePhase.id}
              phase={activePhase}
              progress={progress}
              onUpdate={handleUpdate}
              onNavigate={handleSelect}
              highlightedResourceId={highlightedResourceId}
              onBack={() => setActivePhaseId(null)}
              canPrev={activePhaseIdx > 0}
              canNext={activePhaseIdx < allPhases.length - 1}
              onPrev={() => handleSelect(allPhases[activePhaseIdx - 1].id)}
              onNext={() => handleSelect(allPhases[activePhaseIdx + 1].id)}
              onSearchNavigate={handleSearchNavigate}
            />
          ) : (
            <Overview progress={progress} onSelect={handleSelect} />
          )}
        </div>
      </div>
    </div>
  );
}
