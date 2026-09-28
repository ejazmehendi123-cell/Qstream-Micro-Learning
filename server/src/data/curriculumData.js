import crypto from 'crypto';

export function generateHash(content) {
  return crypto.createHash('sha256').update(content.trim().toLowerCase()).digest('hex');
}

export const LEARNING_PATHS_DATA = [
  {
    id: '11111111-1111-1111-1111-000000000001',
    title: 'Full Stack Web Development',
    slug: 'full-stack-web-development',
    category: 'Web Development',
    difficulty: 'All Levels',
    estimated_minutes: 3600,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
    description: 'Master front-end, back-end, databases, and deployment to build complete modern web applications.',
    prerequisites: ['Basic computer literacy', 'Problem-solving mindset'],
    learning_objectives: [
      'Build responsive UI with HTML5, CSS3, and JavaScript',
      'Create robust RESTful APIs with Node.js and Express',
      'Design relational schemas and manage databases',
      'Deploy full-stack applications with CI/CD and cloud platforms'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000001',
        title: 'Modern HTML5 & Semantic Web',
        slug: 'modern-html5-semantic-web',
        order_index: 1,
        difficulty: 'easy',
        estimated_minutes: 180,
        topic: 'HTML5',
        subtopic: 'Semantics & Accessibility',
        description: 'Understand modern HTML5 semantic elements, accessibility standards (WCAG), and responsive metadata.',
        learning_objectives: ['Implement semantic tags', 'Build accessible forms', 'Configure viewport metadata']
      },
      {
        id: '22222222-2222-2222-2222-000000000002',
        title: 'CSS3 Flexbox, Grid & Responsive Systems',
        slug: 'css3-flexbox-grid-responsive',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'CSS3',
        subtopic: 'Layout Systems',
        description: 'Master advanced layouts using Flexbox, CSS Grid, media queries, and modern fluid typography.',
        learning_objectives: ['Build 2D Grid layouts', 'Use Flexbox alignment', 'Create responsive breakpoints']
      },
      {
        id: '22222222-2222-2222-2222-000000000003',
        title: 'JavaScript DOM & Event Architecture',
        slug: 'javascript-dom-events',
        order_index: 3,
        difficulty: 'medium',
        estimated_minutes: 300,
        topic: 'JavaScript',
        subtopic: 'DOM Manipulation',
        description: 'Learn event delegation, DOM manipulation, asynchronous rendering, and browser storage mechanisms.',
        learning_objectives: ['Manipulate DOM nodes', 'Handle event bubbling and capturing', 'Work with Web Storage']
      },
      {
        id: '22222222-2222-2222-2222-000000000004',
        title: 'Full Stack Integration & Deployment',
        slug: 'full-stack-integration-deployment',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 360,
        topic: 'Deployment',
        subtopic: 'CI/CD & Cloud Hosting',
        description: 'Connect frontends to backend services, handle CORS, manage environment secrets, and deploy to production.',
        learning_objectives: ['Deploy web apps to cloud', 'Configure CORS and reverse proxies', 'Manage production secrets']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000002',
    title: 'MERN Stack Development',
    slug: 'mern-stack-development',
    category: 'Web Development',
    difficulty: 'Intermediate',
    estimated_minutes: 4200,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    description: 'Build enterprise-grade single page applications using MongoDB, Express, React, and Node.js.',
    prerequisites: ['HTML, CSS and core JavaScript knowledge'],
    learning_objectives: [
      'Develop scalable React frontends with state management',
      'Design REST APIs with Express.js architecture',
      'Manage documents and aggregations in MongoDB',
      'Implement JWT authentication and role-based access'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000005',
        title: 'React Components, State & Hooks',
        slug: 'react-components-state-hooks',
        order_index: 1,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'React',
        subtopic: 'State & Lifecycle',
        description: 'Deep dive into functional components, useState, useEffect, custom hooks, and memoization.',
        learning_objectives: ['Manage complex state', 'Handle side-effects cleanly', 'Create reusable custom hooks']
      },
      {
        id: '22222222-2222-2222-2222-000000000006',
        title: 'Express REST API Architecture',
        slug: 'express-rest-api-architecture',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'Express',
        subtopic: 'Routing & Controllers',
        description: 'Structure clean MVC Express backends, custom middleware, rate limiting, and centralized error handling.',
        learning_objectives: ['Build modular router controllers', 'Implement custom middleware', 'Standardize API responses']
      },
      {
        id: '22222222-2222-2222-2222-000000000007',
        title: 'Document Database Design & Queries',
        slug: 'document-database-queries',
        order_index: 3,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'NoSQL Databases',
        subtopic: 'Aggregation & Indexing',
        description: 'Learn document schema patterns, validation, indexing strategies, and aggregation pipelines.',
        learning_objectives: ['Design normalized vs embedded schemas', 'Optimize query indexes', 'Build aggregation pipelines']
      },
      {
        id: '22222222-2222-2222-2222-000000000008',
        title: 'JWT Authentication & Security',
        slug: 'jwt-auth-security',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 300,
        topic: 'Authentication',
        subtopic: 'JWT & Session Security',
        description: 'Implement JSON Web Tokens, refresh token rotation, password hashing with bcrypt, and protected routes.',
        learning_objectives: ['Implement token auth', 'Configure secure cookies and CORS', 'Guard routes on client and server']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000003',
    title: 'JavaScript Mastery',
    slug: 'javascript-mastery',
    category: 'Programming Languages',
    difficulty: 'Intermediate',
    estimated_minutes: 3200,
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80',
    description: 'Master core JavaScript runtime, execution context, closures, event loop, prototypes, and async patterns.',
    prerequisites: ['Basic programming logic'],
    learning_objectives: [
      'Understand V8 execution context, call stack, and memory heap',
      'Master lexical scoping, closures, and higher-order functions',
      'Unravel the event loop, microtasks, macrotasks, and Promises',
      'Master OOP prototypes, classes, and modern ES2024 features'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000009',
        title: 'Execution Context, Hoisting & Scopes',
        slug: 'execution-context-hoisting-scopes',
        order_index: 1,
        difficulty: 'easy',
        estimated_minutes: 180,
        topic: 'JavaScript Engine',
        subtopic: 'Execution Context',
        description: 'Explore the Global Execution Context, lexical environments, variable hoisting, and Temporal Dead Zone.',
        learning_objectives: ['Explain call stack operations', 'Understand TDZ with let/const', 'Debug scoping issues']
      },
      {
        id: '22222222-2222-2222-2222-000000000010',
        title: 'Closures & Functional Programming',
        slug: 'closures-functional-programming',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'JavaScript',
        subtopic: 'Closures',
        description: 'Deep dive into closures, data encapsulation, currying, partial application, and memoization patterns.',
        learning_objectives: ['Implement closures correctly', 'Create memoization functions', 'Avoid memory leaks with closures']
      },
      {
        id: '22222222-2222-2222-2222-000000000011',
        title: 'The Event Loop & Asynchronous JavaScript',
        slug: 'event-loop-async-javascript',
        order_index: 3,
        difficulty: 'hard',
        estimated_minutes: 300,
        topic: 'JavaScript Runtime',
        subtopic: 'Event Loop & Promises',
        description: 'Understand microtasks vs macrotasks, Promise internal states, async/await mechanics, and error handling.',
        learning_objectives: ['Trace event loop execution', 'Handle concurrent promises', 'Implement retry mechanics']
      },
      {
        id: '22222222-2222-2222-2222-000000000012',
        title: 'Prototypes, Prototypal Inheritance & Classes',
        slug: 'prototypes-inheritance-classes',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 240,
        topic: 'JavaScript OOP',
        subtopic: 'Prototypal Inheritance',
        description: 'Master prototype chains, Object.create, class syntax, private fields, and mixins.',
        learning_objectives: ['Traverse prototype chains', 'Implement class inheritance', 'Use ES private fields']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000004',
    title: 'React.js Developer',
    slug: 'reactjs-developer',
    category: 'Web Development',
    difficulty: 'Intermediate',
    estimated_minutes: 3600,
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
    description: 'Learn modern React 18/19 patterns, concurrent features, server components, and performance profiling.',
    prerequisites: ['Solid JavaScript ES6+ knowledge'],
    learning_objectives: [
      'Build scalable component architectures',
      'Optimize renders with useMemo, useCallback, and React.memo',
      'Manage global state with Context, Zustand, and Redux Toolkit',
      'Harness React Suspense and Error Boundaries'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000013',
        title: 'Virtual DOM, Reconciliation & Fiber',
        slug: 'virtual-dom-fiber',
        order_index: 1,
        difficulty: 'medium',
        estimated_minutes: 200,
        topic: 'React Core',
        subtopic: 'Fiber Architecture',
        description: 'Understand diffing algorithms, key prop importance, React Fiber trees, and double buffering.',
        learning_objectives: ['Explain reconciliation mechanics', 'Optimize list rendering keys', 'Avoid unnecessary render passes']
      },
      {
        id: '22222222-2222-2222-2222-000000000014',
        title: 'Advanced Hooks & State Management',
        slug: 'advanced-hooks-state',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 260,
        topic: 'React Hooks',
        subtopic: 'useReducer & Context',
        description: 'Master useReducer, useTransition, useDeferredValue, and scalable state patterns.',
        learning_objectives: ['Build compound components', 'Prevent Context re-render bottlenecks', 'Use concurrent transitions']
      },
      {
        id: '22222222-2222-2222-2222-000000000015',
        title: 'Performance Optimization & Profiling',
        slug: 'react-performance-profiling',
        order_index: 3,
        difficulty: 'hard',
        estimated_minutes: 280,
        topic: 'React Performance',
        subtopic: 'Profiling & Code Splitting',
        description: 'Detect wasteful re-renders using React DevTools Profiler, dynamic imports, and virtualized lists.',
        learning_objectives: ['Profile render phases', 'Apply lazy loading and code splitting', 'Implement list virtualization']
      },
      {
        id: '22222222-2222-2222-2222-000000000016',
        title: 'Design Patterns & Component Architecture',
        slug: 'react-design-patterns',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 260,
        topic: 'React Architecture',
        subtopic: 'Design Patterns',
        description: 'Implement Render Props, Higher Order Components, Compound Components, and Headless UI patterns.',
        learning_objectives: ['Build Headless UI hooks', 'Structure enterprise component libraries', 'Enforce strict prop boundaries']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000005',
    title: 'Node.js Backend Development',
    slug: 'nodejs-backend-development',
    category: 'Backend Development',
    difficulty: 'Intermediate',
    estimated_minutes: 3600,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    description: 'Architect scalable backends using Node.js event streams, worker threads, microservices, and secure APIs.',
    prerequisites: ['Core JavaScript'],
    learning_objectives: [
      'Master libuv event loop and thread pools',
      'Stream massive data without memory leaks',
      'Handle clustering and multi-threading with worker threads',
      'Build resilient microservices with event emitters'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000017',
        title: 'Node.js Runtime & Libuv Architecture',
        slug: 'nodejs-runtime-libuv',
        order_index: 1,
        difficulty: 'medium',
        estimated_minutes: 200,
        topic: 'Node.js Core',
        subtopic: 'Libuv & Threads',
        description: 'Understand the V8 engine, Libuv C library, 4 thread pool workers, and phase queues.',
        learning_objectives: ['Analyze event loop phases', 'Configure UV_THREADPOOL_SIZE', 'Benchmark I/O operations']
      },
      {
        id: '22222222-2222-2222-2222-000000000018',
        title: 'Streams, Buffers & File System',
        slug: 'streams-buffers-filesystem',
        order_index: 2,
        difficulty: 'hard',
        estimated_minutes: 280,
        topic: 'Node.js I/O',
        subtopic: 'Streams & Pipelines',
        description: 'Work with Readable, Writable, Transform streams, Backpressure handling, and memory buffers.',
        learning_objectives: ['Handle backpressure gracefully', 'Transform large file streams', 'Prevent memory leaks in buffers']
      },
      {
        id: '22222222-2222-2222-2222-000000000019',
        title: 'Clustering, PM2 & Worker Threads',
        slug: 'clustering-pm2-workers',
        order_index: 3,
        difficulty: 'hard',
        estimated_minutes: 260,
        topic: 'Concurrency',
        subtopic: 'Worker Threads',
        description: 'Scale Node across multi-core CPUs with cluster module, process managers, and CPU-intensive workers.',
        learning_objectives: ['Distribute traffic with cluster', 'Offload tasks to Worker Threads', 'Manage zero-downtime reloads']
      },
      {
        id: '22222222-2222-2222-2222-000000000020',
        title: 'Backend Security & Hardening',
        slug: 'backend-security-hardening',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 240,
        topic: 'Web Security',
        subtopic: 'API Defense',
        description: 'Defend against SQL injection, NoSQL injection, XSS, CSRF, DDoS, and enforce rate limits.',
        learning_objectives: ['Harden HTTP headers with Helmet', 'Implement IP rate limits', 'Sanitize and validate all inputs']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000006',
    title: 'Python Programming',
    slug: 'python-programming',
    category: 'Programming Languages',
    difficulty: 'Beginner',
    estimated_minutes: 3000,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    description: 'Learn clean, idiomatic Python: from foundational syntax to object-oriented programming and generators.',
    prerequisites: ['None'],
    learning_objectives: [
      'Write clean, readable Python code adhering to PEP 8',
      'Master list comprehensions, generators, and iterators',
      'Understand OOP, magic dunder methods, and decorators',
      'Handle exceptions and file I/O safely'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000021',
        title: 'Python Foundations & Data Structures',
        slug: 'python-foundations-data-structures',
        order_index: 1,
        difficulty: 'easy',
        estimated_minutes: 180,
        topic: 'Python Basics',
        subtopic: 'Data Types',
        description: 'Lists, Tuples, Dictionaries, Sets, mutability, slicing, and memory referencing in Python.',
        learning_objectives: ['Select appropriate collection types', 'Use slicing syntax efficiently', 'Understand shallow vs deep copies']
      },
      {
        id: '22222222-2222-2222-2222-000000000022',
        title: 'Decorators, Generators & Functional Tools',
        slug: 'decorators-generators-functional',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 260,
        topic: 'Python Advanced',
        subtopic: 'Decorators & Generators',
        description: 'Build custom decorators with functools.wraps, memory-efficient generators with yield, and itertools.',
        learning_objectives: ['Write parameterized decorators', 'Produce memory-safe stream generators', 'Use functools and itertools']
      },
      {
        id: '22222222-2222-2222-2222-000000000023',
        title: 'OOP, Dunder Methods & Metaclasses',
        slug: 'oop-dunder-methods-metaclasses',
        order_index: 3,
        difficulty: 'hard',
        estimated_minutes: 280,
        topic: 'Python OOP',
        subtopic: 'Magic Methods',
        description: 'Explore __init__, __repr__, __call__, custom context managers with __enter__/__exit__, and dataclasses.',
        learning_objectives: ['Build robust OOP classes', 'Implement custom context managers', 'Use modern Python dataclasses']
      },
      {
        id: '22222222-2222-2222-2222-000000000024',
        title: 'Asyncio & Concurrent Python',
        slug: 'asyncio-concurrent-python',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 280,
        topic: 'Python Concurrency',
        subtopic: 'Asyncio',
        description: 'Understand the Global Interpreter Lock (GIL), asyncio event loops, coroutines, and multiprocessing.',
        learning_objectives: ['Circumvent the GIL with multiprocessing', 'Run async I/O tasks concurrently', 'Profile Python bottlenecks']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000007',
    title: 'Python for Data Science',
    slug: 'python-for-data-science',
    category: 'Data Science',
    difficulty: 'Intermediate',
    estimated_minutes: 3600,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    description: 'Transform, analyze, and visualize complex datasets using NumPy, Pandas, Matplotlib, and Seaborn.',
    prerequisites: ['Python basics'],
    learning_objectives: [
      'Perform vectorized array computations with NumPy',
      'Clean, transform, and aggregate data with Pandas DataFrames',
      'Create publication-quality visualizations with Matplotlib & Seaborn',
      'Conduct exploratory data analysis (EDA) on real-world datasets'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000025',
        title: 'NumPy Vectorized Arrays & Broadcasting',
        slug: 'numpy-arrays-broadcasting',
        order_index: 1,
        difficulty: 'easy',
        estimated_minutes: 200,
        topic: 'NumPy',
        subtopic: 'Broadcasting & Matrix Operations',
        description: 'Master N-dimensional arrays, vectorization, broadcasting rules, and boolean indexing.',
        learning_objectives: ['Accelerate computations via vectorization', 'Understand broadcasting mechanics', 'Index multi-dimensional tensors']
      },
      {
        id: '22222222-2222-2222-2222-000000000026',
        title: 'Pandas DataFrames & Data Wrangling',
        slug: 'pandas-dataframes-wrangling',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 280,
        topic: 'Pandas',
        subtopic: 'Data Manipulation',
        description: 'Handle missing data, group by aggregations, merges, joins, and time series resampling.',
        learning_objectives: ['Handle null and dirty data', 'Execute complex groupby transforms', 'Join heterogeneous datasets']
      },
      {
        id: '22222222-2222-2222-2222-000000000027',
        title: 'Exploratory Data Analysis & Statistics',
        slug: 'eda-statistics',
        order_index: 3,
        difficulty: 'medium',
        estimated_minutes: 260,
        topic: 'Data Analysis',
        subtopic: 'Statistical EDA',
        description: 'Compute correlations, distributions, outliers, hypotheses, and feature transformations.',
        learning_objectives: ['Detect and treat outliers', 'Compute statistical metrics', 'Prepare clean data for ML']
      },
      {
        id: '22222222-2222-2222-2222-000000000028',
        title: 'Statistical Data Visualization',
        slug: 'statistical-data-visualization',
        order_index: 4,
        difficulty: 'medium',
        estimated_minutes: 220,
        topic: 'Visualization',
        subtopic: 'Seaborn & Matplotlib',
        description: 'Plot heatmaps, violin plots, facet grids, and interactive dashboards to communicate insights.',
        learning_objectives: ['Design intuitive charts', 'Plot multidimensional correlations', 'Export high-res graphics']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000008',
    title: 'Data Structures & Algorithms',
    slug: 'data-structures-and-algorithms',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    estimated_minutes: 4800,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    description: 'Master core CS problem-solving: Big-O, arrays, linked lists, trees, graphs, and dynamic programming.',
    prerequisites: ['Proficiency in any programming language'],
    learning_objectives: [
      'Analyze time and space complexity with asymptotic notation',
      'Implement linear and non-linear data structures from scratch',
      'Solve graph problems using BFS, DFS, Dijkstra, and Topological Sort',
      'Apply dynamic programming memoization and tabulation'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000029',
        title: 'Big-O Analysis & Linear Structures',
        slug: 'big-o-linear-structures',
        order_index: 1,
        difficulty: 'easy',
        estimated_minutes: 240,
        topic: 'Complexity & Structures',
        subtopic: 'Arrays & Linked Lists',
        description: 'Asymptotic complexity, amortized analysis, singly & doubly linked lists, stacks, and queues.',
        learning_objectives: ['Calculate Big-O of algorithms', 'Implement dynamic arrays', 'Reverse and manipulate linked lists']
      },
      {
        id: '22222222-2222-2222-2222-000000000030',
        title: 'Binary Trees, BSTs & Heaps',
        slug: 'binary-trees-bst-heaps',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 320,
        topic: 'Tree Structures',
        subtopic: 'Binary Search Trees',
        description: 'Tree traversals (In-order, Pre-order, Post-order, Level-order), BST operations, and Min/Max heaps.',
        learning_objectives: ['Perform recursive tree traversals', 'Maintain BST properties', 'Implement Priority Queues with Heaps']
      },
      {
        id: '22222222-2222-2222-2222-000000000031',
        title: 'Graph Algorithms: BFS, DFS & Shortest Path',
        slug: 'graph-algorithms-bfs-dfs',
        order_index: 3,
        difficulty: 'hard',
        estimated_minutes: 360,
        topic: 'Graphs',
        subtopic: 'Graph Traversal',
        description: 'Adjacency list representations, cycle detection, bipartite graphs, Dijkstra, and Bellman-Ford.',
        learning_objectives: ['Detect cycles in directed and undirected graphs', 'Compute single-source shortest paths', 'Perform topological sorting']
      },
      {
        id: '22222222-2222-2222-2222-000000000032',
        title: 'Dynamic Programming: Memoization & Tabulation',
        slug: 'dynamic-programming-patterns',
        order_index: 4,
        difficulty: 'advanced',
        estimated_minutes: 420,
        topic: 'Dynamic Programming',
        subtopic: 'DP Patterns',
        description: 'Optimal substructure, overlapping subproblems, 0/1 Knapsack, LCS, LIS, and state transitions.',
        learning_objectives: ['Recognize DP recurrence relations', 'Convert recursion to memoized top-down', 'Build bottom-up space-optimized tables']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000009',
    title: 'Java DSA for Placements',
    slug: 'java-dsa-for-placements',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    estimated_minutes: 4500,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    description: 'Ace technical coding interviews and placement tests using Java Collections Framework and DSA.',
    prerequisites: ['Basic Java syntax'],
    learning_objectives: [
      'Master Java Collections Framework (ArrayList, HashMap, PriorityQueue)',
      'Solve FAANG placement questions in Arrays, Strings, and Matrices',
      'Master Recursion and Backtracking with N-Queens and Sudoku',
      'Optimize space and time complexity for placement coding rounds'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000033',
        title: 'Java Collections & Memory Model',
        slug: 'java-collections-memory',
        order_index: 1,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'Java Framework',
        subtopic: 'Collections Framework',
        description: 'Internal working of HashMap, equals and hashCode contract, ConcurrentHashMap, and Java memory management.',
        learning_objectives: ['Explain HashMap collision handling', 'Implement custom Comparable and Comparator', 'Understand JVM heap allocations']
      },
      {
        id: '22222222-2222-2222-2222-000000000034',
        title: 'Two Pointers & Sliding Window Patterns',
        slug: 'two-pointers-sliding-window',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 280,
        topic: 'Algorithmic Patterns',
        subtopic: 'Sliding Window',
        description: 'Master fixed and dynamic sliding window, fast and slow pointers, and prefix sums for O(N) solutions.',
        learning_objectives: ['Solve substring problems in O(N)', 'Detect linked list cycles with Floyd algorithm', 'Calculate subarray sums with prefix maps']
      },
      {
        id: '22222222-2222-2222-2222-000000000035',
        title: 'Recursion & Backtracking Mastery',
        slug: 'recursion-backtracking-mastery',
        order_index: 3,
        difficulty: 'hard',
        estimated_minutes: 320,
        topic: 'Backtracking',
        subtopic: 'Subsets & Permutations',
        description: 'Formulate state space trees, generate power sets, permutations, N-Queens, and word searches.',
        learning_objectives: ['Prune invalid recursive branches', 'Manage backtracking state restoration', 'Solve complex matrix puzzles']
      },
      {
        id: '22222222-2222-2222-2222-000000000036',
        title: 'Tries, Disjoint Sets & Segment Trees',
        slug: 'tries-disjoint-sets-segment-trees',
        order_index: 4,
        difficulty: 'advanced',
        estimated_minutes: 340,
        topic: 'Advanced DSA',
        subtopic: 'Prefix Trees & Union-Find',
        description: 'Trie implementation for prefix searching, Union-Find with path compression, and range queries.',
        learning_objectives: ['Implement autocomplete with Tries', 'Detect network connectivity with Union-Find', 'Handle dynamic range updates']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000010',
    title: 'AI & Machine Learning',
    slug: 'ai-and-machine-learning',
    category: 'Artificial Intelligence',
    difficulty: 'Intermediate',
    estimated_minutes: 4200,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80',
    description: 'Understand supervised and unsupervised ML algorithms, loss functions, gradient descent, and neural nets.',
    prerequisites: ['Python basics and fundamental calculus/linear algebra'],
    learning_objectives: [
      'Implement Linear and Logistic Regression, Decision Trees, and Random Forests',
      'Evaluate models with Precision, Recall, F1-score, and ROC-AUC',
      'Understand loss functions, backpropagation, and gradient descent',
      'Build basic neural networks with PyTorch / TensorFlow'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000037',
        title: 'Supervised Learning Algorithms',
        slug: 'supervised-learning-algorithms',
        order_index: 1,
        difficulty: 'medium',
        estimated_minutes: 260,
        topic: 'Machine Learning',
        subtopic: 'Regression & Classification',
        description: 'Linear regression, logistic regression, SVMs, decision trees, and ensemble random forests.',
        learning_objectives: ['Train classification models', 'Tune hyperparameters via cross-validation', 'Prevent overfitting and underfitting']
      },
      {
        id: '22222222-2222-2222-2222-000000000038',
        title: 'Unsupervised Learning & Clustering',
        slug: 'unsupervised-learning-clustering',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'Machine Learning',
        subtopic: 'Clustering & PCA',
        description: 'K-Means clustering, hierarchical clustering, DBSCAN, and dimensionality reduction via PCA.',
        learning_objectives: ['Cluster customer segmentation data', 'Reduce feature space with PCA', 'Evaluate clusters with Silhouette scores']
      },
      {
        id: '22222222-2222-2222-2222-000000000039',
        title: 'Neural Networks & Deep Learning',
        slug: 'neural-networks-deep-learning',
        order_index: 3,
        difficulty: 'hard',
        estimated_minutes: 320,
        topic: 'Deep Learning',
        subtopic: 'Multi-layer Perceptrons',
        description: 'Perceptrons, activation functions (ReLU, Sigmoid, Softmax), forward propagation, and backprop.',
        learning_objectives: ['Derive backpropagation gradient updates', 'Select optimal activation functions', 'Train feedforward neural nets']
      },
      {
        id: '22222222-2222-2222-2222-000000000040',
        title: 'Model Evaluation & MLOps Pipelines',
        slug: 'model-evaluation-mlops',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 280,
        topic: 'MLOps',
        subtopic: 'Model Serving',
        description: 'Data drift detection, model versioning, serialization with ONNX, and deploying ML models as APIs.',
        learning_objectives: ['Deploy models with FastAPI', 'Monitor data distribution shifts', 'Containerize inference workloads']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000011',
    title: 'Generative AI',
    slug: 'generative-ai',
    category: 'Artificial Intelligence',
    difficulty: 'Intermediate',
    estimated_minutes: 3800,
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
    description: 'Build modern AI applications with LLMs, Transformer architectures, prompt engineering, RAG, and vector DBs.',
    prerequisites: ['Python and basic machine learning concepts'],
    learning_objectives: [
      'Understand the Transformer attention mechanism (Self-Attention, Multi-Head Attention)',
      'Master prompt engineering techniques (Few-Shot, Chain-of-Thought)',
      'Build Retrieval-Augmented Generation (RAG) systems with Vector Databases',
      'Fine-tune models using PEFT and LoRA'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000041',
        title: 'Transformers & Self-Attention Architecture',
        slug: 'transformers-self-attention',
        order_index: 1,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'Transformers',
        subtopic: 'Attention Mechanism',
        description: 'Scaled dot-product attention, queries, keys, values, positional encodings, and encoder-decoder stacks.',
        learning_objectives: ['Explain self-attention computation', 'Understand token embeddings', 'Compare encoder vs decoder models']
      },
      {
        id: '22222222-2222-2222-2222-000000000042',
        title: 'Prompt Engineering & Structured Outputs',
        slug: 'prompt-engineering-structured-outputs',
        order_index: 2,
        difficulty: 'easy',
        estimated_minutes: 180,
        topic: 'Prompt Engineering',
        subtopic: 'Techniques & Guardrails',
        description: 'System prompting, few-shot prompting, chain-of-thought, function calling, and JSON schema validation.',
        learning_objectives: ['Design prompt templates with high reliability', 'Extract deterministic JSON schema', 'Mitigate hallucinations']
      },
      {
        id: '22222222-2222-2222-2222-000000000043',
        title: 'Retrieval-Augmented Generation (RAG)',
        slug: 'retrieval-augmented-generation-rag',
        order_index: 3,
        difficulty: 'hard',
        estimated_minutes: 320,
        topic: 'RAG Architecture',
        subtopic: 'Vector Search & Embeddings',
        description: 'Document chunking strategies, text embeddings, vector similarity search (cosine, dot product), and reranking.',
        learning_objectives: ['Chunk enterprise documents', 'Perform vector queries in vector databases', 'Implement hybrid search and rerankers']
      },
      {
        id: '22222222-2222-2222-2222-000000000044',
        title: 'Fine-Tuning, LoRA & AI Agents',
        slug: 'fine-tuning-lora-ai-agents',
        order_index: 4,
        difficulty: 'advanced',
        estimated_minutes: 340,
        topic: 'LLM Adaptation',
        subtopic: 'LoRA & Autonomous Agents',
        description: 'Parameter-Efficient Fine-Tuning (PEFT), Low-Rank Adaptation (LoRA), ReAct loops, and multi-agent systems.',
        learning_objectives: ['Fine-tune open weights with LoRA', 'Implement ReAct thought-action-observation cycles', 'Coordinate multi-agent workflows']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000012',
    title: 'Cloud Computing',
    slug: 'cloud-computing',
    category: 'Cloud & Infrastructure',
    difficulty: 'Beginner',
    estimated_minutes: 2800,
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    description: 'Fundamental cloud concepts, IaaS vs PaaS vs SaaS, high availability, fault tolerance, and security.',
    prerequisites: ['Basic computer networking knowledge'],
    learning_objectives: [
      'Differentiate cloud delivery and deployment models',
      'Understand elasticity, scalability, and high availability',
      'Analyze cloud pricing, shared responsibility, and governance',
      'Design fault-tolerant architectures across availability zones'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000045',
        title: 'Cloud Architecture & Service Models',
        slug: 'cloud-architecture-service-models',
        order_index: 1,
        difficulty: 'easy',
        estimated_minutes: 180,
        topic: 'Cloud Concepts',
        subtopic: 'IaaS, PaaS, SaaS',
        description: 'Explore on-premise vs public cloud, capital expense vs operational expense, and SLAs.',
        learning_objectives: ['Identify service models for use cases', 'Evaluate cloud SLAs and uptime', 'Analyze cloud cost models']
      },
      {
        id: '22222222-2222-2222-2222-000000000046',
        title: 'Virtualization & Compute Instances',
        slug: 'virtualization-compute-instances',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 220,
        topic: 'Compute',
        subtopic: 'Virtual Machines & Hypervisors',
        description: 'Type 1 and Type 2 hypervisors, VM sizing, auto-scaling groups, and load balancers.',
        learning_objectives: ['Configure virtual machine instances', 'Set up auto-scaling rules', 'Distribute traffic with load balancers']
      },
      {
        id: '22222222-2222-2222-2222-000000000047',
        title: 'Cloud Storage & Object Stores',
        slug: 'cloud-storage-object-stores',
        order_index: 3,
        difficulty: 'medium',
        estimated_minutes: 200,
        topic: 'Storage',
        subtopic: 'Object, Block & File',
        description: 'Block storage, file storage, object storage (S3), lifecycle policies, and encryption at rest/in transit.',
        learning_objectives: ['Choose between block and object stores', 'Set up data retention lifecycle rules', 'Configure server-side encryption']
      },
      {
        id: '22222222-2222-2222-2222-000000000048',
        title: 'Cloud Security & Compliance',
        slug: 'cloud-security-compliance',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 240,
        topic: 'Cloud Security',
        subtopic: 'Shared Responsibility',
        description: 'IAM roles, least privilege, security groups, audit logs, and SOC2/HIPAA compliance standards.',
        learning_objectives: ['Implement fine-grained IAM policies', 'Audit cloud security events', 'Harden cloud network perimeters']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000013',
    title: 'AWS Cloud Developer',
    slug: 'aws-cloud-developer',
    category: 'Cloud & Infrastructure',
    difficulty: 'Intermediate',
    estimated_minutes: 3600,
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80',
    description: 'Build and deploy serverless and containerized enterprise applications on Amazon Web Services.',
    prerequisites: ['Cloud Computing fundamentals'],
    learning_objectives: [
      'Deploy serverless solutions with AWS Lambda and API Gateway',
      'Store and query data with DynamoDB and RDS',
      'Implement asynchronous messaging with SQS and SNS',
      'Automate infrastructure deployment with AWS CDK / SAM'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000049',
        title: 'Serverless Compute with AWS Lambda',
        slug: 'serverless-compute-aws-lambda',
        order_index: 1,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'AWS Serverless',
        subtopic: 'Lambda & API Gateway',
        description: 'Event-driven triggers, cold starts, memory tuning, execution environments, and REST API integration.',
        learning_objectives: ['Write event-driven Lambda handlers', 'Minimize cold start latency', 'Expose endpoints via API Gateway']
      },
      {
        id: '22222222-2222-2222-2222-000000000050',
        title: 'NoSQL Data Modeling with DynamoDB',
        slug: 'nosql-data-modeling-dynamodb',
        order_index: 2,
        difficulty: 'hard',
        estimated_minutes: 280,
        topic: 'AWS Databases',
        subtopic: 'DynamoDB Single-Table Design',
        description: 'Partition keys, sort keys, Global Secondary Indexes (GSIs), single-table design, and transactions.',
        learning_objectives: ['Design single-table DynamoDB schemas', 'Query using partition and sort keys', 'Handle high throughput with GSIs']
      },
      {
        id: '22222222-2222-2222-2222-000000000051',
        title: 'Decoupled Messaging with SQS & SNS',
        slug: 'decoupled-messaging-sqs-sns',
        order_index: 3,
        difficulty: 'medium',
        estimated_minutes: 220,
        topic: 'AWS Messaging',
        subtopic: 'Fanout Pattern',
        description: 'Standard vs FIFO queues, Dead Letter Queues (DLQ), SNS topic subscriptions, and fanout architectures.',
        learning_objectives: ['Implement pub/sub fanout architectures', 'Handle poison messages with DLQs', 'Ensure FIFO ordering semantics']
      },
      {
        id: '22222222-2222-2222-2222-000000000052',
        title: 'AWS VPC Networking & Infrastructure as Code',
        slug: 'aws-vpc-networking-iac',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 300,
        topic: 'AWS Networking',
        subtopic: 'VPC & CloudFormation',
        description: 'Public/private subnets, NAT gateways, route tables, security groups, and provisioning with CloudFormation/CDK.',
        learning_objectives: ['Isolate database layers in private subnets', 'Route outbound traffic through NAT gateways', 'Define cloud stacks as code']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000014',
    title: 'DevOps Engineering',
    slug: 'devops-engineering',
    category: 'DevOps & Systems',
    difficulty: 'Intermediate',
    estimated_minutes: 3800,
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=600&auto=format&fit=crop&q=80',
    description: 'Bridge development and operations with automated CI/CD pipelines, Infrastructure as Code, and observability.',
    prerequisites: ['Linux fundamentals and basic scripting'],
    learning_objectives: [
      'Build automated CI/CD pipelines with GitHub Actions',
      'Manage cloud infrastructure declaratively with Terraform',
      'Implement centralized logging, metrics, and alerting',
      'Execute blue-green and canary deployment strategies'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000053',
        title: 'CI/CD Pipelines with GitHub Actions',
        slug: 'ci-cd-github-actions',
        order_index: 1,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'CI/CD',
        subtopic: 'Workflow Automation',
        description: 'Triggers, matrices, caching dependencies, secrets management, linting, automated testing, and releases.',
        learning_objectives: ['Write multi-stage GitHub Actions workflows', 'Cache package dependencies effectively', 'Automate semantic version releases']
      },
      {
        id: '22222222-2222-2222-2222-000000000054',
        title: 'Infrastructure as Code with Terraform',
        slug: 'infrastructure-as-code-terraform',
        order_index: 2,
        difficulty: 'hard',
        estimated_minutes: 300,
        topic: 'IaC',
        subtopic: 'Terraform Modules & State',
        description: 'HCL syntax, provider configurations, remote state locking with S3/DynamoDB, and modular architecture.',
        learning_objectives: ['Write reusable Terraform modules', 'Manage remote state locking securely', 'Plan and apply cloud diffs safely']
      },
      {
        id: '22222222-2222-2222-2222-000000000055',
        title: 'Observability: Prometheus, Grafana & ELK',
        slug: 'observability-prometheus-grafana',
        order_index: 3,
        difficulty: 'hard',
        estimated_minutes: 260,
        topic: 'Monitoring',
        subtopic: 'Metrics & Alerting',
        description: 'The four golden signals, pulling metrics with Prometheus, building dashboards in Grafana, and log aggregations.',
        learning_objectives: ['Instrument apps with Prometheus counters', 'Design actionable Grafana dashboards', 'Configure alerting rules on latency']
      },
      {
        id: '22222222-2222-2222-2222-000000000056',
        title: 'Deployment Strategies: Blue-Green & Canary',
        slug: 'deployment-strategies-blue-green',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 240,
        topic: 'Deployments',
        subtopic: 'Zero Downtime',
        description: 'Rolling updates, blue-green environments, canary traffic splitting with ingress controllers, and rollbacks.',
        learning_objectives: ['Implement zero-downtime releases', 'Shift traffic progressively in canary stages', 'Trigger automatic rollback on error spikes']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000015',
    title: 'Docker & Kubernetes',
    slug: 'docker-and-kubernetes',
    category: 'DevOps & Systems',
    difficulty: 'Intermediate',
    estimated_minutes: 4000,
    thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&auto=format&fit=crop&q=80',
    description: 'Containerize applications with lightweight Docker images and orchestrate microservices with Kubernetes clusters.',
    prerequisites: ['Linux command line familiarity'],
    learning_objectives: [
      'Create multi-stage, security-hardened Dockerfiles',
      'Compose multi-container local stacks with Docker Compose',
      'Deploy pods, deployments, and services to Kubernetes',
      'Manage ingress, configmaps, secrets, and persistent storage'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000057',
        title: 'Docker Internals & Multi-Stage Builds',
        slug: 'docker-internals-multi-stage',
        order_index: 1,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'Docker',
        subtopic: 'Image Optimization',
        description: 'Linux cgroups and namespaces, layered file systems, cache optimization, and non-root security.',
        learning_objectives: ['Build tiny production images using Alpine/Distroless', 'Optimize Docker layer caching', 'Run containers with non-root privileges']
      },
      {
        id: '22222222-2222-2222-2222-000000000058',
        title: 'Kubernetes Core Architecture & Pods',
        slug: 'kubernetes-architecture-pods',
        order_index: 2,
        difficulty: 'hard',
        estimated_minutes: 300,
        topic: 'Kubernetes',
        subtopic: 'Control Plane & Workloads',
        description: 'API Server, etcd, Kubelet, Kube-proxy, Pod lifecycle, Deployments, ReplicaSets, and rolling updates.',
        learning_objectives: ['Explain Kubernetes control plane interactions', 'Deploy self-healing container pods', 'Manage deployment rollouts and rollbacks']
      },
      {
        id: '22222222-2222-2222-2222-000000000059',
        title: 'Services, Ingress & Cluster Networking',
        slug: 'services-ingress-cluster-networking',
        order_index: 3,
        difficulty: 'hard',
        estimated_minutes: 280,
        topic: 'Kubernetes Networking',
        subtopic: 'Ingress & Service Mesh',
        description: 'ClusterIP, NodePort, LoadBalancer services, Ingress controllers, CoreDNS, and network policies.',
        learning_objectives: ['Expose internal pods via ClusterIP and Ingress', 'Configure TLS termination on Ingress', 'Isolate pod communications with NetworkPolicies']
      },
      {
        id: '22222222-2222-2222-2222-000000000060',
        title: 'ConfigMaps, Secrets & Persistent Volumes',
        slug: 'configmaps-secrets-persistent-volumes',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 260,
        topic: 'Kubernetes Storage',
        subtopic: 'State Management',
        description: 'Decoupling configuration with ConfigMaps, managing base64 Secrets, PersistentVolumes, and PVCs.',
        learning_objectives: ['Inject environment configs from ConfigMaps', 'Mount Kubernetes Secrets safely', 'Bind dynamic storage claims for databases']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000016',
    title: 'Cybersecurity Fundamentals',
    slug: 'cybersecurity-fundamentals',
    category: 'Security',
    difficulty: 'Beginner',
    estimated_minutes: 3000,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    description: 'Learn offensive and defensive fundamentals: cryptography, OWASP Top 10, penetration testing, and zero trust.',
    prerequisites: ['Networking basics'],
    learning_objectives: [
      'Understand symmetric and asymmetric cryptographic ciphers',
      'Identify and remediate OWASP Top 10 vulnerabilities',
      'Analyze network packet captures and detect anomalies',
      'Implement Zero Trust architecture principles'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000061',
        title: 'Applied Cryptography & PKI',
        slug: 'applied-cryptography-pki',
        order_index: 1,
        difficulty: 'medium',
        estimated_minutes: 220,
        topic: 'Cryptography',
        subtopic: 'Symmetric & Asymmetric Ciphers',
        description: 'AES-GCM, RSA, Elliptic Curve (ECC), SHA-256/3 hashing, Digital Signatures, and Certificate Authorities.',
        learning_objectives: ['Select proper encryption ciphers', 'Verify digital signatures and certificates', 'Prevent common cryptographic nonce reuse']
      },
      {
        id: '22222222-2222-2222-2222-000000000062',
        title: 'OWASP Top 10 Web Vulnerabilities',
        slug: 'owasp-top-10-vulnerabilities',
        order_index: 2,
        difficulty: 'hard',
        estimated_minutes: 280,
        topic: 'AppSec',
        subtopic: 'OWASP Top 10',
        description: 'SQLi, Stored/Reflected XSS, Broken Object Level Authorization (BOLA), SSRF, and Security Misconfiguration.',
        learning_objectives: ['Exploit and patch SQL injection bugs', 'Defend against Cross-Site Scripting (XSS)', 'Fix Broken Object Level Authorization']
      },
      {
        id: '22222222-2222-2222-2222-000000000063',
        title: 'Network Defense, Firewalls & IDS/IPS',
        slug: 'network-defense-firewalls',
        order_index: 3,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'Network Security',
        subtopic: 'Packet Analysis',
        description: 'Wireshark packet analysis, stateful firewalls, WAF rules, Snort IDS, and port scan detection.',
        learning_objectives: ['Inspect PCAP network traffic', 'Configure Web Application Firewall rules', 'Detect port scans and SYN flood attacks']
      },
      {
        id: '22222222-2222-2222-2222-000000000064',
        title: 'Identity, Access Management & Zero Trust',
        slug: 'iam-zero-trust-architecture',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 260,
        topic: 'Enterprise Security',
        subtopic: 'Zero Trust',
        description: 'Multi-Factor Authentication (MFA), OAuth2 / OIDC flows, RBAC vs ABAC, and continuous verification.',
        learning_objectives: ['Implement robust OAuth2 flows', 'Enforce Attribute-Based Access Control', 'Design Zero Trust network policies']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000017',
    title: 'Database & SQL Mastery',
    slug: 'database-and-sql-mastery',
    category: 'Databases',
    difficulty: 'Intermediate',
    estimated_minutes: 3600,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    description: 'Master relational modeling, advanced SQL queries, window functions, indexing, and ACID transaction isolation.',
    prerequisites: ['Basic math and logic'],
    learning_objectives: [
      'Write complex analytical SQL using Window Functions and CTEs',
      'Design normalized databases up to BCNF',
      'Optimize query execution plans using EXPLAIN ANALYZE',
      'Understand ACID isolation levels and prevent race conditions'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000065',
        title: 'Advanced SQL: Window Functions & CTEs',
        slug: 'advanced-sql-window-functions-ctes',
        order_index: 1,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'SQL Queries',
        subtopic: 'Analytical Functions',
        description: 'ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(), partition windows, and recursive CTEs.',
        learning_objectives: ['Compute rolling metrics with window functions', 'Traverse hierarchical graphs with recursive CTEs', 'Optimize subqueries with CTE caching']
      },
      {
        id: '22222222-2222-2222-2222-000000000066',
        title: 'Relational Modeling & Normalization',
        slug: 'relational-modeling-normalization',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 220,
        topic: 'Database Design',
        subtopic: 'Normalization 1NF-BCNF',
        description: 'Functional dependencies, 1NF, 2NF, 3NF, Boyce-Codd Normal Form, and pragmatic denormalization.',
        learning_objectives: ['Identify functional dependencies', 'Normalize schemas to 3NF/BCNF', 'Denormalize selectively for read performance']
      },
      {
        id: '22222222-2222-2222-2222-000000000067',
        title: 'B-Trees, Indexing & Query Optimization',
        slug: 'b-trees-indexing-optimization',
        order_index: 3,
        difficulty: 'hard',
        estimated_minutes: 300,
        topic: 'PostgreSQL Internals',
        subtopic: 'Indexes & Query Plans',
        description: 'B-Tree, GIN, GiST, BRIN indexes, composite index column ordering, and reading EXPLAIN ANALYZE.',
        learning_objectives: ['Eliminate sequential table scans', 'Order composite index columns correctly', 'Interpret query plan cost and buffers']
      },
      {
        id: '22222222-2222-2222-2222-000000000068',
        title: 'ACID Transactions & Concurrency Isolation',
        slug: 'acid-transactions-concurrency',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 280,
        topic: 'Concurrency',
        subtopic: 'Isolation Levels',
        description: 'Dirty reads, non-repeatable reads, phantom reads, Read Committed, Repeatable Read, and Serializable MVCC.',
        learning_objectives: ['Prevent double-spend race conditions', 'Select optimal isolation levels', 'Implement row-level locking with SELECT FOR UPDATE']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000018',
    title: 'Git & GitHub',
    slug: 'git-and-github',
    category: 'Developer Tools',
    difficulty: 'Beginner',
    estimated_minutes: 2200,
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&auto=format&fit=crop&q=80',
    description: 'Master version control: branching strategies, interactive rebasing, merge conflict resolution, and PR workflows.',
    prerequisites: ['Terminal basics'],
    learning_objectives: [
      'Understand Git internals (Blobs, Trees, Commits, Tags)',
      'Clean commit history with interactive rebase',
      'Resolve complex multi-file merge conflicts cleanly',
      'Collaborate via GitHub Pull Request reviews and branch protections'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000069',
        title: 'Git Architecture & Object Model',
        slug: 'git-architecture-object-model',
        order_index: 1,
        difficulty: 'easy',
        estimated_minutes: 160,
        topic: 'Git Fundamentals',
        subtopic: 'Git Objects',
        description: 'How Git stores snapshots, .git directory structure, SHA-1/256 hashing, references, and HEAD.',
        learning_objectives: ['Inspect the .git objects directory', 'Differentiate staging vs working tree', 'Understand snapshot vs delta models']
      },
      {
        id: '22222222-2222-2222-2222-000000000070',
        title: 'Interactive Rebasing & History Rewriting',
        slug: 'interactive-rebasing-history',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 200,
        topic: 'Git Operations',
        subtopic: 'Rebase & Cherry-Pick',
        description: 'git rebase -i, squash, fixup, reword, git cherry-pick, and git reflog for recovering lost commits.',
        learning_objectives: ['Squash messy feature commits', 'Recover detached HEAD commits via reflog', 'Rebase cleanly onto main branches']
      },
      {
        id: '22222222-2222-2222-2222-000000000071',
        title: 'Merge Conflicts & Bisect Debugging',
        slug: 'merge-conflicts-bisect-debugging',
        order_index: 3,
        difficulty: 'medium',
        estimated_minutes: 180,
        topic: 'Troubleshooting',
        subtopic: 'Git Bisect',
        description: 'Understanding 3-way merges, diff3 formatting, conflict markers, and binary searching bugs with git bisect.',
        learning_objectives: ['Resolve merge conflicts accurately', 'Find regression commits via git bisect', 'Stash and pop working changes']
      },
      {
        id: '22222222-2222-2222-2222-000000000072',
        title: 'Branching Strategies & Team Workflows',
        slug: 'branching-strategies-team-workflows',
        order_index: 4,
        difficulty: 'medium',
        estimated_minutes: 180,
        topic: 'Collaboration',
        subtopic: 'Trunk-Based vs GitFlow',
        description: 'GitFlow, GitHub Flow, Trunk-Based Development, branch protection rules, and CODEOWNERS.',
        learning_objectives: ['Adopt trunk-based development', 'Configure pull request review gates', 'Enforce conventional commits']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000019',
    title: 'System Design Fundamentals',
    slug: 'system-design-fundamentals',
    category: 'Architecture',
    difficulty: 'Advanced',
    estimated_minutes: 4500,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    description: 'Design highly scalable distributed systems: CAP theorem, caching layers, sharding, rate limiting, and queues.',
    prerequisites: ['Backend and database knowledge'],
    learning_objectives: [
      'Apply the CAP theorem and PACELC in architectural trade-offs',
      'Design distributed caching with Redis and Cache-Aside pattern',
      'Scale relational databases with Read Replicas, Sharding, and Consistent Hashing',
      'Design real-world systems: URL shortener, Twitter timeline, Uber dispatch'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000073',
        title: 'Distributed Systems Principles & CAP',
        slug: 'distributed-systems-cap-theorem',
        order_index: 1,
        difficulty: 'hard',
        estimated_minutes: 260,
        topic: 'System Architecture',
        subtopic: 'CAP & PACELC',
        description: 'Consistency, Availability, Partition Tolerance, latency vs consistency, and event-driven architectures.',
        learning_objectives: ['Evaluate CAP trade-offs for systems', 'Differentiate Strong vs Eventual Consistency', 'Handle network partition scenarios']
      },
      {
        id: '22222222-2222-2222-2222-000000000074',
        title: 'Caching Strategies & Content Delivery',
        slug: 'caching-strategies-cdn',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'Performance',
        subtopic: 'Distributed Caching',
        description: 'Cache-Aside, Write-Through, Write-Behind, Cache Eviction (LRU/LFU), Cache Stampede, and CDN edge caching.',
        learning_objectives: ['Prevent cache stampede with distributed locks', 'Choose between Cache-Aside and Write-Through', 'Optimize CDN hit ratios']
      },
      {
        id: '22222222-2222-2222-2222-000000000075',
        title: 'Database Sharding & Consistent Hashing',
        slug: 'database-sharding-consistent-hashing',
        order_index: 3,
        difficulty: 'advanced',
        estimated_minutes: 320,
        topic: 'Scalability',
        subtopic: 'Partitioning & Hashing',
        description: 'Horizontal vs vertical sharding, shard keys, rebalancing hotspots, and consistent hashing rings with virtual nodes.',
        learning_objectives: ['Implement consistent hashing rings', 'Select optimal database shard keys', 'Rebalance partitions without downtime']
      },
      {
        id: '22222222-2222-2222-2222-000000000076',
        title: 'Designing Real-World Distributed Systems',
        slug: 'designing-real-world-systems',
        order_index: 4,
        difficulty: 'advanced',
        estimated_minutes: 360,
        topic: 'Case Studies',
        subtopic: 'System Design Interview',
        description: 'Deep dive into URL Shorteners (TinyURL), Distributed Rate Limiters (Token Bucket), and Social Newsfeeds.',
        learning_objectives: ['Estimate back-of-the-envelope capacity', 'Design Token Bucket rate limiters', 'Architect high-fanout newsfeeds']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000020',
    title: 'Computer Networks',
    slug: 'computer-networks',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    estimated_minutes: 3200,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    description: 'Understand the Internet: OSI 7-layer model, TCP/IP handshake, DNS, HTTP/2 & HTTP/3, and WebSockets.',
    prerequisites: ['Basic operating system familiarity'],
    learning_objectives: [
      'Trace data packets through the OSI and TCP/IP protocol stacks',
      'Analyze TCP 3-way handshake, congestion control, and flow control',
      'Explain DNS resolution hierarchy and record types (A, CNAME, MX)',
      'Compare HTTP/1.1 pipelining, HTTP/2 multiplexing, and HTTP/3 QUIC'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000077',
        title: 'OSI Model & TCP/IP Architecture',
        slug: 'osi-model-tcp-ip-architecture',
        order_index: 1,
        difficulty: 'easy',
        estimated_minutes: 200,
        topic: 'Network Layers',
        subtopic: 'OSI 7 Layers',
        description: 'Physical, Data Link, Network, Transport, Session, Presentation, Application layers and packet encapsulation.',
        learning_objectives: ['Map real protocols to OSI layers', 'Inspect MAC and IP frame headers', 'Analyze MTU fragmentation']
      },
      {
        id: '22222222-2222-2222-2222-000000000078',
        title: 'TCP vs UDP & Congestion Control',
        slug: 'tcp-vs-udp-congestion-control',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'Transport Layer',
        subtopic: 'TCP Reliability',
        description: 'SYN-SYN/ACK-ACK handshake, sequence/ack numbers, sliding window flow control, and TCP Reno/BBR congestion.',
        learning_objectives: ['Explain TCP connection teardown states', 'Calculate sliding window throughput', 'Select UDP vs TCP for real-time audio/gaming']
      },
      {
        id: '22222222-2222-2222-2222-000000000079',
        title: 'DNS Resolution & Routing Protocols',
        slug: 'dns-resolution-routing-protocols',
        order_index: 3,
        difficulty: 'medium',
        estimated_minutes: 220,
        topic: 'Network Services',
        subtopic: 'DNS & BGP',
        description: 'Recursive vs iterative DNS queries, authoritative nameservers, TTL caching, BGP routing, and autonomous systems.',
        learning_objectives: ['Trace end-to-end DNS lookups', 'Configure DNS records (A, AAAA, CNAME)', 'Understand BGP route advertisement']
      },
      {
        id: '22222222-2222-2222-2222-000000000080',
        title: 'Evolution of HTTP: HTTP/1.1 to HTTP/3 QUIC',
        slug: 'evolution-of-http-quic',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 260,
        topic: 'Application Layer',
        subtopic: 'HTTP Protocols',
        description: 'Head-of-line blocking, binary framing in HTTP/2, UDP-based QUIC protocol in HTTP/3, and WebSocket bidirectional pipes.',
        learning_objectives: ['Diagnose head-of-line blocking', 'Leverage HTTP/2 multiplexed streams', 'Establish full-duplex WebSockets']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000021',
    title: 'Operating Systems',
    slug: 'operating-systems',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    estimated_minutes: 3400,
    thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80',
    description: 'Learn OS internals: process scheduling, threads, virtual memory, paging, deadlocks, and file systems.',
    prerequisites: ['Basic C or computer architecture familiarity'],
    learning_objectives: [
      'Understand process control blocks (PCB) and context switching',
      'Analyze CPU scheduling algorithms (SJF, Round Robin, Multi-level Feedback Queue)',
      'Master virtual memory translation, page tables, and TLB caches',
      'Detect and prevent deadlocks with Banker algorithm and mutexes'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000081',
        title: 'Processes, Threads & Context Switching',
        slug: 'processes-threads-context-switching',
        order_index: 1,
        difficulty: 'medium',
        estimated_minutes: 220,
        topic: 'OS Processes',
        subtopic: 'Process States',
        description: 'Process life cycle states, fork/exec system calls, user threads vs kernel threads, and IPC mechanisms.',
        learning_objectives: ['Differentiate processes from threads', 'Calculate context switch overhead', 'Implement shared memory and pipe IPC']
      },
      {
        id: '22222222-2222-2222-2222-000000000082',
        title: 'CPU Scheduling Algorithms',
        slug: 'cpu-scheduling-algorithms',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 220,
        topic: 'CPU Scheduling',
        subtopic: 'Scheduling Algorithms',
        description: 'Preemptive vs non-preemptive scheduling, FCFS, Shortest Job First, Round Robin time slices, and MLFQ.',
        learning_objectives: ['Calculate turnaround and waiting times', 'Tune Round Robin time quantum', 'Prevent starvation in priority scheduling']
      },
      {
        id: '22222222-2222-2222-2222-000000000083',
        title: 'Virtual Memory, Paging & TLB',
        slug: 'virtual-memory-paging-tlb',
        order_index: 3,
        difficulty: 'hard',
        estimated_minutes: 280,
        topic: 'Memory Management',
        subtopic: 'Paging & TLB',
        description: 'Logical to physical address translation, multi-level page tables, Translation Lookaside Buffer, and page fault handling.',
        learning_objectives: ['Translate addresses using page tables', 'Evaluate LRU/FIFO page replacement algorithms', 'Analyze thrashing prevention strategies']
      },
      {
        id: '22222222-2222-2222-2222-000000000084',
        title: 'Synchronization, Deadlocks & Semaphores',
        slug: 'synchronization-deadlocks-semaphores',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 280,
        topic: 'Concurrency',
        subtopic: 'Deadlock Handling',
        description: 'Race conditions, critical sections, Mutexes, Counting Semaphores, Coffman 4 conditions, and Banker algorithm.',
        learning_objectives: ['Solve the Producer-Consumer problem with semaphores', 'Identify Coffman deadlock conditions', 'Run Banker safety algorithm checks']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000022',
    title: 'DBMS',
    slug: 'dbms-core',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    estimated_minutes: 3200,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    description: 'Relational database management systems: ER models, relational algebra, SQL DDL/DML, and storage engines.',
    prerequisites: ['Basic discrete mathematics'],
    learning_objectives: [
      'Construct Entity-Relationship (ER) and Enhanced ER diagrams',
      'Formulate relational algebra expressions (Selection, Projection, Join)',
      'Implement data integrity constraints and cascading triggers',
      'Analyze physical storage structures, heap files, and hash indexes'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000085',
        title: 'ER Modeling & Relational Mapping',
        slug: 'er-modeling-relational-mapping',
        order_index: 1,
        difficulty: 'easy',
        estimated_minutes: 200,
        topic: 'Data Modeling',
        subtopic: 'ER Diagrams',
        description: 'Entities, strong/weak entity sets, relationships, cardinalities, and converting ER models to relational tables.',
        learning_objectives: ['Draw comprehensive ER diagrams', 'Translate 1:N and M:N relationships into foreign keys', 'Identify weak entity identifying relationships']
      },
      {
        id: '22222222-2222-2222-2222-000000000086',
        title: 'Relational Algebra & Tuple Calculus',
        slug: 'relational-algebra-tuple-calculus',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'Query Formalisms',
        subtopic: 'Relational Algebra',
        description: 'Unary and binary relational operators: Sigma (Select), Pi (Project), Cartesian Product, Natural Join, and Division.',
        learning_objectives: ['Formulate relational algebra queries', 'Perform relational division operations', 'Optimize algebraic query trees']
      },
      {
        id: '22222222-2222-2222-2222-000000000087',
        title: 'Integrity Constraints & Triggers',
        slug: 'integrity-constraints-triggers',
        order_index: 3,
        difficulty: 'medium',
        estimated_minutes: 220,
        topic: 'Database Rules',
        subtopic: 'Constraints & Triggers',
        description: 'Domain constraints, Entity integrity, Referential integrity, ON DELETE CASCADE/SET NULL, and PL/pgSQL triggers.',
        learning_objectives: ['Enforce complex business rules via triggers', 'Define cascading referential constraints', 'Audit record modifications automatically']
      },
      {
        id: '22222222-2222-2222-2222-000000000088',
        title: 'Physical Storage & Index Structures',
        slug: 'physical-storage-index-structures',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 260,
        topic: 'Storage Engines',
        subtopic: 'Disk Storage & Indexes',
        description: 'Fixed and variable record formats, slotted pages, primary vs secondary indexes, and dense vs sparse indexing.',
        learning_objectives: ['Explain slotted-page layout in disk blocks', 'Differentiate clustered vs unclustered indexes', 'Analyze I/O block transfer costs']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000023',
    title: 'Software Engineering',
    slug: 'software-engineering',
    category: 'Engineering Best Practices',
    difficulty: 'Intermediate',
    estimated_minutes: 3000,
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80',
    description: 'SDLC models, Agile/Scrum, SOLID design principles, clean architecture, automated testing, and code quality.',
    prerequisites: ['Experience with any programming language'],
    learning_objectives: [
      'Apply SOLID design principles to craft maintainable software',
      'Execute Agile and Scrum sprints with user stories and story points',
      'Write Unit, Integration, and End-to-End automated tests',
      'Implement Clean Architecture with loose coupling and dependency inversion'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000089',
        title: 'SOLID Design Principles & Clean Code',
        slug: 'solid-design-principles-clean-code',
        order_index: 1,
        difficulty: 'medium',
        estimated_minutes: 220,
        topic: 'Software Design',
        subtopic: 'SOLID Principles',
        description: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.',
        learning_objectives: ['Refactor tightly coupled code adhering to SOLID', 'Enforce Liskov Substitution contracts', 'Invert dependencies using interfaces']
      },
      {
        id: '22222222-2222-2222-2222-000000000090',
        title: 'Agile Methodologies & Scrum Framework',
        slug: 'agile-methodologies-scrum',
        order_index: 2,
        difficulty: 'easy',
        estimated_minutes: 180,
        topic: 'Agile Practices',
        subtopic: 'Scrum Ceremonies',
        description: 'Scrum roles (Product Owner, Scrum Master, Dev Team), sprint planning, daily standups, retrospectives, and velocity.',
        learning_objectives: ['Facilitate effective Scrum ceremonies', 'Estimate story points using Planning Poker', 'Track team velocity with burndown charts']
      },
      {
        id: '22222222-2222-2222-2222-000000000091',
        title: 'Testing Strategies: Unit, Integration & E2E',
        slug: 'testing-strategies-unit-integration-e2e',
        order_index: 3,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'Quality Assurance',
        subtopic: 'Testing Pyramid',
        description: 'The testing pyramid, Test-Driven Development (TDD), mocking and stubbing, and E2E browser automation.',
        learning_objectives: ['Write TDD unit tests with Jest/Vitest', 'Mock external network and database calls', 'Achieve high test coverage without brittle tests']
      },
      {
        id: '22222222-2222-2222-2222-000000000092',
        title: 'Clean Architecture & Domain-Driven Design',
        slug: 'clean-architecture-ddd',
        order_index: 4,
        difficulty: 'hard',
        estimated_minutes: 280,
        topic: 'Enterprise Architecture',
        subtopic: 'Clean Architecture',
        description: 'Entities, Use Cases, Interface Adapters, Frameworks, Hexagonal Architecture, and Bounded Contexts in DDD.',
        learning_objectives: ['Isolate core domain logic from UI and DB', 'Implement Hexagonal Ports and Adapters', 'Define DDD Aggregates and Value Objects']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000024',
    title: 'Interview Preparation',
    slug: 'interview-preparation',
    category: 'Career & Placement',
    difficulty: 'All Levels',
    estimated_minutes: 3200,
    thumbnail: 'https://images.unsplash.com/photo-1565688842991-df4360f6c188?w=600&auto=format&fit=crop&q=80',
    description: 'Comprehensive preparation for technical coding rounds, behavioral interviews (STAR method), and negotiation.',
    prerequisites: ['Basic DSA and core CS subjects'],
    learning_objectives: [
      'Master the 5-step technical problem solving framework',
      'Structure behavioral answers using the STAR method',
      'Communicate thought process clearly under pressure',
      'Navigate compensation and offer negotiations'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000093',
        title: 'Technical Problem Solving Framework',
        slug: 'technical-problem-solving-framework',
        order_index: 1,
        difficulty: 'medium',
        estimated_minutes: 220,
        topic: 'Technical Interviews',
        subtopic: 'Live Coding Strategy',
        description: 'Clarifying constraints, dry running test cases, identifying edge cases, thinking out loud, and refactoring.',
        learning_objectives: ['Ask clarifying edge case questions', 'Think out loud while coding algorithms', 'Analyze time/space tradeoffs on the fly']
      },
      {
        id: '22222222-2222-2222-2222-000000000094',
        title: 'Behavioral Interviews & STAR Method',
        slug: 'behavioral-interviews-star-method',
        order_index: 2,
        difficulty: 'easy',
        estimated_minutes: 180,
        topic: 'Behavioral Interviews',
        subtopic: 'STAR Framework',
        description: 'Situation, Task, Action, Result methodology, leadership principles, conflict resolution, and failure stories.',
        learning_objectives: ['Formulate compelling STAR stories', 'Answer leadership conflict questions diplomatically', 'Quantify business impact and outcomes']
      },
      {
        id: '22222222-2222-2222-2222-000000000095',
        title: 'System Design Interview Execution',
        slug: 'system-design-interview-execution',
        order_index: 3,
        difficulty: 'hard',
        estimated_minutes: 280,
        topic: 'Design Interviews',
        subtopic: 'Whiteboarding Flow',
        description: '45-minute pacing: requirement scoping (5m), capacity estimations (5m), high level design (15m), and deep dive (15m).',
        learning_objectives: ['Scope functional and non-functional requirements', 'Draw clean component interaction diagrams', 'Deep-dive into bottlenecks and single points of failure']
      },
      {
        id: '22222222-2222-2222-2222-000000000096',
        title: 'Offer Evaluation & Salary Negotiation',
        slug: 'offer-evaluation-salary-negotiation',
        order_index: 4,
        difficulty: 'easy',
        estimated_minutes: 160,
        topic: 'Career Navigation',
        subtopic: 'Negotiation',
        description: 'Evaluating total compensation (base, bonus, equity/RSUs, benefits), counter-offering respectfully, and timing.',
        learning_objectives: ['Calculate realistic value of equity packages', 'Negotiate with confidence and market data', 'Compare multi-offer timelines gracefully']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000025',
    title: 'Aptitude & Logical Reasoning',
    slug: 'aptitude-and-logical-reasoning',
    category: 'Aptitude & Placement',
    difficulty: 'Beginner',
    estimated_minutes: 2800,
    thumbnail: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=80',
    description: 'Master quantitative aptitude, number systems, permutations, probability, and logical reasoning puzzles.',
    prerequisites: ['High school mathematics'],
    learning_objectives: [
      'Solve quantitative aptitude questions in under 60 seconds using speed math',
      'Master time, speed, distance, work, and pipes & cisterns',
      'Solve probability, combinations, and permutations questions',
      'Crack syllogisms, blood relations, and seating arrangement puzzles'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000097',
        title: 'Speed Math & Number Systems',
        slug: 'speed-math-number-systems',
        order_index: 1,
        difficulty: 'easy',
        estimated_minutes: 180,
        topic: 'Quantitative Aptitude',
        subtopic: 'Number Systems',
        description: 'Vedic math shortcuts, divisibility rules, unit digits, remainders theorem, and HCF/LCM applications.',
        learning_objectives: ['Calculate square roots and percentages mentally', 'Find remainders with Fermat Little Theorem', 'Solve HCF and LCM word problems']
      },
      {
        id: '22222222-2222-2222-2222-000000000098',
        title: 'Time, Speed, Distance & Work',
        slug: 'time-speed-distance-work',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 220,
        topic: 'Quantitative Aptitude',
        subtopic: 'Arithmetic',
        description: 'Relative speed, trains crossing platforms, boats and streams, man-day work equivalence, and efficiency.',
        learning_objectives: ['Solve relative speed train problems', 'Calculate upstream and downstream speeds', 'Determine joint work completion rates']
      },
      {
        id: '22222222-2222-2222-2222-000000000099',
        title: 'Permutations, Combinations & Probability',
        slug: 'permutations-combinations-probability',
        order_index: 3,
        difficulty: 'medium',
        estimated_minutes: 240,
        topic: 'Combinatorics',
        subtopic: 'Probability',
        description: 'Fundamental counting principle, nPr and nCr, circular arrangements, conditional probability, and Bayes theorem.',
        learning_objectives: ['Distinguish order-sensitive permutations from combinations', 'Compute circular permutation variants', 'Apply Bayes rule to conditional events']
      },
      {
        id: '22222222-2222-2222-2222-000000000100',
        title: 'Logical Deductions & Seating Arrangements',
        slug: 'logical-deductions-seating-arrangements',
        order_index: 4,
        difficulty: 'medium',
        estimated_minutes: 220,
        topic: 'Logical Reasoning',
        subtopic: 'Puzzles & Syllogisms',
        description: 'Venn diagram syllogisms, blood relations trees, directional sense, linear and circular seating arrangements.',
        learning_objectives: ['Evaluate syllogistic conclusions via Venn diagrams', 'Map family blood relations correctly', 'Solve multi-parameter seating puzzles']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000026',
    title: 'Communication Skills',
    slug: 'communication-skills',
    category: 'Soft Skills',
    difficulty: 'Beginner',
    estimated_minutes: 2400,
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    description: 'Elevate professional communication: email etiquette, assertive speaking, active listening, and technical presentations.',
    prerequisites: ['None'],
    learning_objectives: [
      'Write clear, concise technical and business emails',
      'Communicate complex technical concepts to non-technical stakeholders',
      'Practice active listening and constructive feedback',
      'Deliver engaging presentations with high audience retention'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000101',
        title: 'Professional Email & Written Communication',
        slug: 'professional-email-written-communication',
        order_index: 1,
        difficulty: 'easy',
        estimated_minutes: 160,
        topic: 'Business Communication',
        subtopic: 'Email Etiquette',
        description: 'Subject lines, bottom line up front (BLUF), tone calibration, action item clarity, and following up gracefully.',
        learning_objectives: ['Format emails with BLUF clarity', 'Adopt professional constructive tone', 'Summarize meeting action items unambiguously']
      },
      {
        id: '22222222-2222-2222-2222-000000000102',
        title: 'Translating Tech to Business Stakeholders',
        slug: 'translating-tech-to-business',
        order_index: 2,
        difficulty: 'medium',
        estimated_minutes: 200,
        topic: 'Executive Communication',
        subtopic: 'Stakeholder Management',
        description: 'Framing technical debt as financial risk, metric-driven ROI explanations, and avoiding confusing jargon.',
        learning_objectives: ['Frame tech trade-offs in business metrics', 'Explain architectures using intuitive analogies', 'Gain executive buy-in for refactoring']
      },
      {
        id: '22222222-2222-2222-2222-000000000103',
        title: 'Active Listening & Constructive Feedback',
        slug: 'active-listening-constructive-feedback',
        order_index: 3,
        difficulty: 'easy',
        estimated_minutes: 160,
        topic: 'Interpersonal Skills',
        subtopic: 'Feedback Models',
        description: 'Paraphrasing for clarity, non-verbal cues, SBI (Situation-Behavior-Impact) feedback model, and code review etiquette.',
        learning_objectives: ['Apply Situation-Behavior-Impact feedback', 'Conduct empathetic code reviews', 'Defuse tense architectural disagreements']
      },
      {
        id: '22222222-2222-2222-2222-000000000104',
        title: 'High-Impact Technical Presentations',
        slug: 'high-impact-technical-presentations',
        order_index: 4,
        difficulty: 'medium',
        estimated_minutes: 200,
        topic: 'Public Speaking',
        subtopic: 'Slide Design & Delivery',
        description: 'Storytelling arc for technical demos, minimal slide design, handling difficult Q&A, and pacing voice tone.',
        learning_objectives: ['Structure technical demos with dramatic arc', 'Design clean, readable slide decks', 'Confidently field tough audience questions']
      }
    ]
  },
  {
    id: '11111111-1111-1111-1111-000000000027',
    title: 'Resume & LinkedIn Preparation',
    slug: 'resume-and-linkedin-preparation',
    category: 'Career & Placement',
    difficulty: 'Beginner',
    estimated_minutes: 2200,
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80',
    description: 'Craft ATS-beating resumes, optimize LinkedIn profiles for recruiter search, and build an impressive developer portfolio.',
    prerequisites: ['None'],
    learning_objectives: [
      'Write impact-driven bullet points using the Google X-Y-Z formula',
      'Format resumes for 100% ATS parseability',
      'Optimize LinkedIn headline, summary, and skills for recruiter SEO',
      'Showcase open source and side projects in a standout portfolio'
    ],
    modules: [
      {
        id: '22222222-2222-2222-2222-000000000105',
        title: 'The Google X-Y-Z Resume Formula',
        slug: 'google-xyz-resume-formula',
        order_index: 1,
        difficulty: 'easy',
        estimated_minutes: 160,
        topic: 'Resume Writing',
        subtopic: 'Impact Metrics',
        description: '"Accomplished [X], as measured by [Y], by doing [Z]". Transforming passive duties into quantified business wins.',
        learning_objectives: ['Quantify project achievements with metrics', 'Eliminate vague responsibility phrases', 'Align action verbs with industry standards']
      },
      {
        id: '22222222-2222-2222-2222-000000000106',
        title: 'Applicant Tracking Systems (ATS) Optimization',
        slug: 'ats-optimization-formatting',
        order_index: 2,
        difficulty: 'easy',
        estimated_minutes: 140,
        topic: 'Resume Technicalities',
        subtopic: 'ATS Compliance',
        description: 'Single-column layouts, standard fonts, keyword matching from job postings, and avoiding parsing errors.',
        learning_objectives: ['Format resumes for clean ATS parsing', 'Perform keyword gap analysis against job descriptions', 'Test resume readability using automated parsers']
      },
      {
        id: '22222222-2222-2222-2222-000000000107',
        title: 'LinkedIn Recruiter Search Optimization (SEO)',
        slug: 'linkedin-recruiter-seo',
        order_index: 3,
        difficulty: 'medium',
        estimated_minutes: 180,
        topic: 'LinkedIn Branding',
        subtopic: 'Profile Searchability',
        description: 'Targeted headlines, keyword-rich About sections, skill endorsements, and featured project showcases.',
        learning_objectives: ['Rank in top LinkedIn Recruiter search results', 'Write an engaging developer story in the About section', 'Pin high-impact open source repositories']
      },
      {
        id: '22222222-2222-2222-2222-000000000108',
        title: 'Developer Portfolio & GitHub Curation',
        slug: 'developer-portfolio-github-curation',
        order_index: 4,
        difficulty: 'medium',
        estimated_minutes: 200,
        topic: 'Personal Branding',
        subtopic: 'GitHub Profile',
        description: 'README.md presentation, live deployed demo links, clean commit graphs, and documenting architectural decisions.',
        learning_objectives: ['Write exemplary README files with architecture diagrams', 'Host responsive interactive live project demos', 'Curate GitHub profile pins to impress hiring managers']
      }
    ]
  }
];
