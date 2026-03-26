import { createBrowserRouter } from 'react-router';
import { Onboarding } from './components/onboarding';
import { CompanionSelection } from './components/companion-selection';
import { DailySession } from './components/daily-session';
import { ChoosePractice } from './components/choose-practice';
import { Settings } from './components/settings';
import { ParentDashboard } from './components/parent-dashboard';
import { Garden } from './components/garden';
import { LogicCurriculum } from './components/logic-curriculum';
import { MusicCurriculum } from './components/music-curriculum';
import { CreativeCurriculum } from './components/creative-curriculum';
import { CategoryScreen } from './components/category-screen';

// Game imports
import { PatternMatch } from './components/games/pattern-match';
import { ColorSort } from './components/games/color-sort';
import { MemoryMatch } from './components/games/memory-match';
import { NumberCounting } from './components/games/number-counting';
import { ShapeFind } from './components/games/shape-find';
import { SizeOrder } from './components/games/size-order';
import { SequenceNext } from './components/games/sequence-next';
import { RuleFinder } from './components/games/rule-finder';
import { ColorMatch } from './components/games/color-match';
import { AnimalNames } from './components/games/animal-names';
import { ObjectMatch } from './components/games/object-match';
import { CreativeDraw } from './components/games/creative-draw';
import { FocusTap } from './components/games/focus-tap';
import { MathFun } from './components/games/math-fun';
import { MemoryPairs } from './components/games/memory-pairs';
import { WordsFind } from './components/games/words-find';
import { ShapesRotate } from './components/games/shapes-rotate';
import { ListenRepeat } from './components/games/listen-repeat';
import { RhythmMatch } from './components/games/rhythm-match';
import { ColorMixingLab } from './components/games/color-mixing-lab';
import { SymmetryMirror } from './components/games/symmetry-mirror';
import { ConstellationCreator } from './components/games/constellation-creator';
import { ComingSoon } from './components/games/coming-soon';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Onboarding,
  },
  {
    path: '/choose-companion',
    Component: CompanionSelection,
  },
  {
    path: '/categories',
    Component: ChoosePractice,
  },
  {
    path: '/daily',
    Component: DailySession,
  },
  {
    path: '/practice',
    Component: ChoosePractice,
  },
  {
    path: '/settings',
    Component: Settings,
  },
  {
    path: '/dashboard',
    Component: ParentDashboard,
  },
  {
    path: '/garden',
    Component: Garden,
  },
  {
    path: '/game/logic',
    Component: LogicCurriculum,
  },
  {
    path: '/game/music',
    Component: MusicCurriculum,
  },
  {
    path: '/game/creative',
    Component: CreativeCurriculum,
  },
  {
    path: '/game/:categoryId',
    Component: CategoryScreen,
  },
  // Game routes
  {
    path: '/game/pattern-match',
    Component: PatternMatch,
  },
  {
    path: '/game/color-sort',
    Component: ColorSort,
  },
  {
    path: '/game/memory-match',
    Component: MemoryMatch,
  },
  {
    path: '/game/number-counting',
    Component: NumberCounting,
  },
  {
    path: '/game/shape-find',
    Component: ShapeFind,
  },
  {
    path: '/game/size-order',
    Component: SizeOrder,
  },
  {
    path: '/game/sequence-next',
    Component: SequenceNext,
  },
  {
    path: '/game/rule-finder',
    Component: RuleFinder,
  },
  {
    path: '/game/color-match',
    Component: ColorMatch,
  },
  {
    path: '/game/animal-names',
    Component: AnimalNames,
  },
  {
    path: '/game/object-match',
    Component: ObjectMatch,
  },
  {
    path: '/game/creative-draw',
    Component: CreativeDraw,
  },
  {
    path: '/game/focus-tap',
    Component: FocusTap,
  },
  {
    path: '/game/math-fun',
    Component: MathFun,
  },
  {
    path: '/game/memory-pairs',
    Component: MemoryPairs,
  },
  {
    path: '/game/words-find',
    Component: WordsFind,
  },
  {
    path: '/game/shapes-rotate',
    Component: ShapesRotate,
  },
  {
    path: '/game/listen-repeat',
    Component: ListenRepeat,
  },
  {
    path: '/game/rhythm-match',
    Component: RhythmMatch,
  },
  {
    path: '/game/color-mixing-lab',
    Component: ColorMixingLab,
  },
  {
    path: '/game/symmetry-mirror',
    Component: SymmetryMirror,
  },
  {
    path: '/game/constellation-creator',
    Component: ConstellationCreator,
  },
  {
    path: '/coming-soon',
    Component: ComingSoon,
  },
]);