import { CodeLanguage } from '../types/modes';

export const CODE_LANGUAGES: CodeLanguage[] = [
  {
    id: 'python',
    name: 'Python',
    extension: '.py',
    icon: 'Terminal',
    snippets: [
      {
        id: 'py-1',
        title: 'Binary Search Implementation',
        difficulty: 'Easy',
        description: 'Logarithmic search on a sorted list',
        code: `def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
      },
      {
        id: 'py-2',
        title: 'LRU Cache with OrderedDict',
        difficulty: 'Medium',
        description: 'Least-Recently-Used caching mechanism',
        code: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        val = self.cache.pop(key)
        self.cache[key] = val
        return val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.pop(key)
        elif len(self.cache) >= self.capacity:
            oldest = next(iter(self.cache))
            del self.cache[oldest]
        self.cache[key] = value`
      },
      {
        id: 'py-3',
        title: 'Async Task Queue with Asyncio',
        difficulty: 'Hard',
        description: 'Worker pool with error handling',
        code: `async def worker(queue: asyncio.Queue, results: list):
    while not queue.empty():
        job_id, payload = await queue.get()
        try:
            res = await process_job(payload)
            results.append({"id": job_id, "status": "ok", "data": res})
        except Exception as err:
            results.append({"id": job_id, "status": "fail", "error": str(err)})
        finally:
            queue.task_done()`
      }
    ]
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    extension: '.js',
    icon: 'FileCode2',
    snippets: [
      {
        id: 'js-1',
        title: 'Deep Clone & Memoization',
        difficulty: 'Easy',
        description: 'Higher-order function caching results',
        code: `const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};`
      },
      {
        id: 'js-2',
        title: 'Custom Promise All Implementation',
        difficulty: 'Medium',
        description: 'Resolving array of asynchronous promises',
        code: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve(results);

    promises.forEach((p, idx) => {
      Promise.resolve(p).then((val) => {
        results[idx] = val;
        completed += 1;
        if (completed === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}`
      },
      {
        id: 'js-3',
        title: 'Event Emitter Pub/Sub Pattern',
        difficulty: 'Hard',
        description: 'Publish-subscribe observer pattern',
        code: `class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  on(event, listener) {
    if (!this.events.has(event)) this.events.set(event, new Set());
    this.events.get(event).add(listener);
    return () => this.off(event, listener);
  }
  emit(event, ...data) {
    if (!this.events.has(event)) return false;
    this.events.get(event).forEach((fn) => fn(...data));
    return true;
  }
}`
      }
    ]
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    extension: '.ts',
    icon: 'Code',
    snippets: [
      {
        id: 'ts-1',
        title: 'Generic Result Type & Pattern Match',
        difficulty: 'Easy',
        description: 'Type-safe error handling without exceptions',
        code: `type Result<T, E = Error> = 
  | { success: true; data: T } 
  | { success: false; error: E };

function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  if (result.success) {
    return result.data;
  }
  return fallback;
}`
      },
      {
        id: 'ts-2',
        title: 'Strict Deep Partial & Recursive Mappings',
        difficulty: 'Medium',
        description: 'Advanced conditional mapped types',
        code: `type DeepReadonly<T> = T extends Function | boolean | number | string
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<DeepReadonly<U>>
  : { readonly [P in keyof T]: DeepReadonly<T[P]> };

interface ConfigState {
  readonly endpoint: string;
  readonly retries: number;
  readonly flags: Record<string, boolean>;
}`
      }
    ]
  },
  {
    id: 'cpp',
    name: 'C++',
    extension: '.cpp',
    icon: 'Layers',
    snippets: [
      {
        id: 'cpp-1',
        title: 'Dijkstra Shortest Path Algorithm',
        difficulty: 'Medium',
        description: 'Priority queue graph traversal',
        code: `vector<int> dijkstra(int n, int src, vector<vector<pair<int, int>>>& adj) {
    vector<int> dist(n, 1e9);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;
        for (auto& edge : adj[u]) {
            int v = edge.first, w = edge.second;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`
      },
      {
        id: 'cpp-2',
        title: 'Smart Pointers & RAII Template',
        difficulty: 'Hard',
        description: 'Custom memory resource allocator',
        code: `template <typename T>
class UniquePointer {
private:
    T* ptr;
public:
    explicit UniquePointer(T* p = nullptr) : ptr(p) {}
    ~UniquePointer() { delete ptr; }
    UniquePointer(const UniquePointer&) = delete;
    UniquePointer& operator=(const UniquePointer&) = delete;
    UniquePointer(UniquePointer&& other) noexcept : ptr(other.ptr) {
        other.ptr = nullptr;
    }
    T& operator*() const { return *ptr; }
    T* operator->() const { return ptr; }
};`
      }
    ]
  },
  {
    id: 'java',
    name: 'Java',
    extension: '.java',
    icon: 'Coffee',
    snippets: [
      {
        id: 'java-1',
        title: 'Thread-Safe Singleton with Double-Checked Locking',
        difficulty: 'Medium',
        description: 'Concurrency design pattern in modern Java',
        code: `public final class DatabasePool {
    private static volatile DatabasePool instance;
    private final List<Connection> pool;

    private DatabasePool() {
        this.pool = new CopyOnWriteArrayList<>();
    }

    public static DatabasePool getInstance() {
        if (instance == null) {
            synchronized (DatabasePool.class) {
                if (instance == null) {
                    instance = new DatabasePool();
                }
            }
        }
        return instance;
    }
}`
      }
    ]
  },
  {
    id: 'sql',
    name: 'SQL',
    extension: '.sql',
    icon: 'Database',
    snippets: [
      {
        id: 'sql-1',
        title: 'Window Functions & Rank Partitioning',
        difficulty: 'Medium',
        description: 'Analytics query calculating student rankings',
        code: `WITH StudentScores AS (
    SELECT 
        student_id,
        course_id,
        gpa,
        DENSE_RANK() OVER (PARTITION BY course_id ORDER BY gpa DESC) as course_rank
    FROM enrollments
    WHERE semester = 'Fall 2026'
)
SELECT s.student_id, u.full_name, s.course_id, s.gpa
FROM StudentScores s
JOIN users u ON u.id = s.student_id
WHERE s.course_rank <= 3
ORDER BY s.course_id, s.course_rank;`
      }
    ]
  }
];
