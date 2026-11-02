import { AcademicSubject } from '../types/modes';

export const ACADEMIC_SUBJECTS: AcademicSubject[] = [
  {
    id: 'cs',
    name: 'Computer Science',
    icon: 'Cpu',
    description: 'Algorithms, data structures, operating systems, and complexity theory.',
    passages: [
      {
        id: 'cs-1',
        title: 'Asymptotic Analysis & Big O',
        difficulty: 'Easy',
        content: 'Asymptotic notation describes the limiting behavior of an execution time function when the argument tends towards a particular value or infinity. In theoretical computer science, Big O notation characterizes functions according to their growth rates, allowing engineers to compare algorithm efficiency independently of hardware architecture.',
        source: 'Introduction to Algorithms (CLRS)'
      },
      {
        id: 'cs-2',
        title: 'Distributed Consensus & Raft',
        difficulty: 'Medium',
        content: 'Consensus algorithms allow a collection of machines to work as a coherent group that can survive the failures of some of its members. Raft decomposes consensus into leader election, log replication, and safety. A node operates in one of three states: leader, follower, or candidate, transitioning upon election timeouts.',
        source: 'In Search of an Understandable Consensus Algorithm'
      },
      {
        id: 'cs-3',
        title: 'Turing Completeness & The Halting Problem',
        difficulty: 'Hard',
        content: 'Alan Turing proved in 1936 that a general algorithm to solve the halting problem for all possible program-input pairs cannot exist. By constructing a diagonalization paradox with a hypothetical decider H, it follows mathematically that undecidable decision problems fundamentally constrain formal axiomatic computation.',
        source: 'On Computable Numbers with an Application to the Entscheidungsproblem'
      }
    ]
  },
  {
    id: 'math',
    name: 'Mathematics',
    icon: 'Binary',
    description: 'Linear algebra, real analysis, differential equations, and abstract algebra.',
    passages: [
      {
        id: 'math-1',
        title: 'Eigenvalues and Eigenvectors',
        difficulty: 'Easy',
        content: 'An eigenvector of a linear transformation is a non-zero vector that changes at most by a scalar factor when that linear transformation is applied. The corresponding eigenvalue is the factor by which the eigenvector is scaled. Geometrically, it corresponds to invariant multidimensional directions.',
        source: 'Linear Algebra and Its Applications'
      },
      {
        id: 'math-2',
        title: 'Fourier Transform & Frequency Domain',
        difficulty: 'Medium',
        content: 'The Fourier transform decomposes an arbitrary function of time into frequencies that make it up, analogous to how a musical chord can be expressed as the frequencies of its constituent notes. The continuous transform maps an integrable function into complex-valued continuous spectra.',
        source: 'Fourier Analysis and Differential Equations'
      },
      {
        id: 'math-3',
        title: 'Topology and Compact Manifolds',
        difficulty: 'Hard',
        content: 'A topological space is compact if every open cover has a finite subcover. On Hausdorff spaces, compactness is equivalent to every sequence having a convergent subsequence. The Heine-Borel theorem establishes that any subset of Euclidean space is compact if and only if it is closed and bounded.',
        source: 'Topology (Munkres)'
      }
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering',
    icon: 'Cog',
    description: 'Thermodynamics, electrical circuits, control systems, and mechanics.',
    passages: [
      {
        id: 'eng-1',
        title: 'The Second Law of Thermodynamics',
        difficulty: 'Easy',
        content: 'The second law of thermodynamics asserts that the total entropy of an isolated system can never decrease over time. Natural processes are irreversible; energy spontaneously disperses from regions of high concentration to lower concentration until thermodynamic equilibrium is achieved.',
        source: 'Thermodynamics: An Engineering Approach'
      },
      {
        id: 'eng-2',
        title: 'PID Feedback Control Loops',
        difficulty: 'Medium',
        content: 'A proportional-integral-derivative controller continuously calculates an error value as the difference between a desired setpoint and a measured process variable. It applies a correction based on proportional gain, integral accumulation, and derivative predictive damping.',
        source: 'Modern Control Engineering'
      },
      {
        id: 'eng-3',
        title: 'Semiconductor Bandgap & Carrier Mobility',
        difficulty: 'Hard',
        content: 'In solid-state physics, the energy band gap represents the minimum energy required to excite an electron from the top of the valence band to the bottom of the conduction band. Doping with donor or acceptor impurities alters the Fermi level, determining majority charge carrier concentration.',
        source: 'Solid State Electronic Devices'
      }
    ]
  },
  {
    id: 'science',
    name: 'Science & Medicine',
    icon: 'FlaskConical',
    description: 'Neuroscience, molecular genetics, organic chemistry, and quantum physics.',
    passages: [
      {
        id: 'sci-1',
        title: 'CRISPR-Cas9 Gene Editing',
        difficulty: 'Easy',
        content: 'CRISPR sequences are bacterial defense mechanisms against bacteriophages. By pairing a synthetic single-guide RNA with the Cas9 endonuclease enzyme, researchers can target specific genomic loci and induce double-strand DNA breaks to facilitate precise gene insertion or knockout.',
        source: 'Nature Biotechnology Review'
      },
      {
        id: 'sci-2',
        title: 'Synaptic Plasticity & Long-Term Potentiation',
        difficulty: 'Medium',
        content: 'Long-term potentiation is a persistent strengthening of synapses based on recent patterns of activity. When high-frequency stimulation activates presynaptic glutamate release, NMDA receptors depolarize the postsynaptic membrane, triggering calcium influx and AMPA receptor insertion.',
        source: 'Principles of Neural Science (Kandel)'
      },
      {
        id: 'sci-3',
        title: 'Wave-Particle Duality & Schrödinger Equation',
        difficulty: 'Hard',
        content: 'Quantum mechanics dictates that matter exhibits both particle and wavelike properties. The time-dependent Schrödinger equation describes how the quantum state of a physical system changes over time, yielding probability density amplitudes whose squared moduli predict measurement outcomes.',
        source: 'Introduction to Quantum Mechanics (Griffiths)'
      }
    ]
  },
  {
    id: 'business',
    name: 'Business & Economics',
    icon: 'TrendingUp',
    description: 'Game theory, corporate finance, market equilibrium, and macroeconomic models.',
    passages: [
      {
        id: 'biz-1',
        title: 'Nash Equilibrium & Strategic Dominance',
        difficulty: 'Easy',
        content: 'A Nash equilibrium is a decision combination where no player has an incentive to deviate unilaterally from their chosen strategy. In non-cooperative game theory, it represents a stable state where each participant responds optimally to the anticipated strategies of all other competitors.',
        source: 'Microeconomic Theory'
      },
      {
        id: 'biz-2',
        title: 'Capital Asset Pricing Model (CAPM)',
        difficulty: 'Medium',
        content: 'The Capital Asset Pricing Model calculates the theoretical required rate of return of an asset, accounting for systematic non-diversifiable risk as measured by beta. Assets with higher volatility relative to the overall market benchmark demand higher expected risk premiums.',
        source: 'Journal of Finance'
      },
      {
        id: 'biz-3',
        title: 'Monetary Policy & The Taylor Rule',
        difficulty: 'Hard',
        content: 'The Taylor rule provides an empirical econometric guideline for how central banks should adjust nominal interest rates in response to changes in inflation rates and economic output gaps. Stabilizing macroeconomic fluctuations requires raising real rates faster than inflation spikes.',
        source: 'Carnegie-Rochester Conference Series on Public Policy'
      }
    ]
  },
  {
    id: 'english',
    name: 'Academic Writing & Philosophy',
    icon: 'BookOpen',
    description: 'Epistemology, critical argumentation, rhetoric, and scholarly discourse.',
    passages: [
      {
        id: 'eng-lit-1',
        title: 'The Structure of Scientific Revolutions',
        difficulty: 'Easy',
        content: 'Normal science proceeds within an established paradigm through cumulative puzzle-solving. When persistent anomalies cannot be reconciled within existing theoretical frameworks, a crisis emerges, culminating in a paradigm shift that fundamentally transforms ontological assumptions.',
        source: 'Thomas Kuhn (1962)'
      },
      {
        id: 'eng-lit-2',
        title: 'Epistemic Justification & Foundationalism',
        difficulty: 'Medium',
        content: 'Classical foundationalism maintains that all justified beliefs ultimately rest upon basic beliefs that require no further inferential support. In contrast, coherentism posits that justification is holistic, depending on the mutual consistency and explanatory interconnectedness of the epistemic web.',
        source: 'Stanford Encyclopedia of Philosophy'
      },
      {
        id: 'eng-lit-3',
        title: 'Dialectical Argumentation and Synthesis',
        difficulty: 'Hard',
        content: 'Hegelian dialectic posits that intellectual history unfolds through a dynamic progression wherein a thesis generates its opposing antithesis. Through rigorous critique, the contradictions between both concepts are sublated into a higher synthesis preserving the truth of both.',
        source: 'Phenomenology of Spirit (G.W.F. Hegel)'
      }
    ]
  }
];
