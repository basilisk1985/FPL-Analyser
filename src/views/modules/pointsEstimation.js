/**
 * Fit a non linear (quadratic) formula:
 *   points ≈ a * difficulty^2 + b * difficulty + c
 *
 * games: array of objects like:
 *   { difficulty: number, points: number }
 *
 * returns:
 *   { a, b, c, predict(difficulty) }
 */
function fitPlayerDifficultyModel(games) {
  if (!games || games.length === 0) {
    throw new Error("No games data provided");
  }

  // Step 1: aggregate by difficulty so noisy fixtures are smoothed
  const byDifficulty = new Map();

  for (const g of games) {
    const d = Number(g.difficulty);
    const p = Number(g.points);
    if (Number.isNaN(d) || Number.isNaN(p)) continue;

    if (!byDifficulty.has(d)) {
      byDifficulty.set(d, { sumPts: 0, count: 0 });
    }
    const entry = byDifficulty.get(d);
    entry.sumPts += p;
    entry.count += 1;
  }

  // Build arrays of x (difficulty) and y (avg points)
  const xs = [];
  const ys = [];

  for (const [diff, { sumPts, count }] of byDifficulty.entries()) {
    xs.push(diff);
    ys.push(sumPts / count);
  }

  const n = xs.length;
  if (n < 3) {
    throw new Error("Need at least 3 distinct difficulty levels to fit a quadratic");
  }

  // Step 2: compute sums for quadratic least squares
  let Sx = 0, Sx2 = 0, Sx3 = 0, Sx4 = 0;
  let Sy = 0, Sxy = 0, Sx2y = 0;

  for (let i = 0; i < n; i++) {
    const x = xs[i];
    const y = ys[i];
    const x2 = x * x;
    const x3 = x2 * x;
    const x4 = x2 * x2;

    Sx += x;
    Sx2 += x2;
    Sx3 += x3;
    Sx4 += x4;

    Sy += y;
    Sxy += x * y;
    Sx2y += x2 * y;
  }

  // Normal equations for quadratic regression:
  // [ n   Sx   Sx2 ] [ c ]   [ Sy   ]
  // [ Sx  Sx2  Sx3 ] [ b ] = [ Sxy  ]
  // [ Sx2 Sx3  Sx4 ] [ a ]   [ Sx2y ]
  //
  // Solve this 3x3 system. We use Cramers rule style helpers.

  function det3(m) {
    return (
      m[0] * (m[4] * m[8] - m[5] * m[7]) -
      m[1] * (m[3] * m[8] - m[5] * m[6]) +
      m[2] * (m[3] * m[7] - m[4] * m[6])
    );
  }

  const M = [
    n,   Sx,  Sx2,
    Sx,  Sx2, Sx3,
    Sx2, Sx3, Sx4
  ];

  const Bc = [
    Sy,  Sx,  Sx2,
    Sxy, Sx2, Sx3,
    Sx2y, Sx3, Sx4
  ];

  const Bb = [
    n,   Sy,  Sx2,
    Sx,  Sxy, Sx3,
    Sx2, Sx2y, Sx4
  ];

  const Ba = [
    n,   Sx,  Sy,
    Sx,  Sx2, Sxy,
    Sx2, Sx3, Sx2y
  ];

  const detM = det3(M);

  if (Math.abs(detM) < 1e-9) {
    throw new Error("Cannot fit model, matrix is singular or nearly singular");
  }

  const c = det3(Bc) / detM;
  const b = det3(Bb) / detM;
  const a = det3(Ba) / detM;

  // Return coefficients and a predict helper
  return {
    a,
    b,
    c,
    predict(difficulty) {
      const d = Number(difficulty);
      return a * d * d + b * d + c;
    }
  };
}

/**
 * Example: using your Raya data
 */
const rayaGames = [
  { difficulty: 3, points: 1 },  // GW1
  { difficulty: 2, points: 6 },  // GW2
  { difficulty: 4, points: 2 },  // GW3
  { difficulty: 2, points: 6 },  // GW4
  { difficulty: 4, points: 2 },  // GW5
  { difficulty: 4, points: 2 },  // GW6
  { difficulty: 2, points: 6 },  // GW7
  { difficulty: 3, points: 6 },  // GW8
  { difficulty: 3, points: 6 },  // GW9
  { difficulty: 2, points: 6 },  // GW10
  { difficulty: 3, points: 1 },  // GW11
  { difficulty: 3, points: 2 },  // GW12
  { difficulty: 3, points: 3 },  // GW13
  { difficulty: 3, points: 6 },  // GW14
  { difficulty: 3, points: 2 }   // GW15
];

const model = fitPlayerDifficultyModel(rayaGames);
console.log("Model coefficients:", model); // { a, b, c, predict: f }

/**
 * Testing how close we are for historical GWs
 */
for (const g of rayaGames) {
  const pred = model.predict(g.difficulty);
  console.log(
    `Diff ${g.difficulty} | actual ${g.points} | predicted ${pred.toFixed(2)}`
  );
}
