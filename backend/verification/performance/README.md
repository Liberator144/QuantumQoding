# Performance Analyzer

The Performance Analyzer module provides tools for analyzing the performance impact of code changes. It helps developers identify performance regressions and improvements by comparing benchmark results over time.

## Features

- **Benchmark Discovery**: Automatically finds benchmarks for a given file
- **Benchmark Execution**: Runs benchmarks with warmup iterations and collects performance metrics
- **Performance Comparison**: Compares current benchmark results with previous runs
- **Significance Analysis**: Identifies significant performance changes based on configurable thresholds
- **Detailed Reporting**: Generates comprehensive reports with performance metrics and comparisons

## Installation

The Performance Analyzer is part of the Quantum-Unified Database package. No additional installation is required.

## Usage

### Basic Usage

```javascript
const { PerformanceAnalyzer } = require('quantum-unified/src/verification/performance');

// Create a performance analyzer
const analyzer = new PerformanceAnalyzer({
  debugMode: true, // Enable debug logging
  iterations: 10, // Number of iterations for each benchmark
  warmupIterations: 3, // Warmup iterations before measuring
  significantChangeThreshold: 5, // Threshold for significant performance change (percentage)
});

// Analyze a file
async function analyzePerformance() {
  const result = await analyzer.analyzeFile('/path/to/file.js');

  if (result.success) {
    console.log(result.report.summary);
  } else {
    console.error(`Error: ${result.error}`);
  }
}

analyzePerformance();
```

### Command-Line Usage

You can also use the command-line tool to analyze performance:

```bash
# Analyze a file
node scripts/analyze-performance.js analyze /path/to/file.js

# Create a benchmark template for a file
node scripts/analyze-performance.js create-template /path/to/file.js

# Enable debug mode
node scripts/analyze-performance.js analyze /path/to/file.js --debug
```

## Creating Benchmarks

To create benchmarks for a file, create a file with the same name as the source file but with `.benchmark.js` extension in the `benchmarks` directory.

Example benchmark file:

```javascript
// myFile.benchmark.js
module.exports = [
  {
    name: 'myFunction-case1',
    description: 'Benchmark for myFunction with case 1',
    run: function () {
      const { myFunction } = require('../path/to/myFile');
      return myFunction(sampleData1);
    },
  },
  {
    name: 'myFunction-case2',
    description: 'Benchmark for myFunction with case 2',
    run: function () {
      const { myFunction } = require('../path/to/myFile');
      return myFunction(sampleData2);
    },
  },
];
```

You can also use the `create-template` command to generate a benchmark template:

```bash
node scripts/analyze-performance.js create-template /path/to/file.js
```

## Configuration Options

The `PerformanceAnalyzer` constructor accepts the following options:

| Option                       | Description                                               | Default                                           |
| ---------------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| `debugMode`                  | Enable debug logging                                      | `false`                                           |
| `baseDir`                    | Base directory                                            | `process.cwd()`                                   |
| `benchmarkDir`               | Benchmark directory                                       | `path.join(process.cwd(), 'benchmarks')`          |
| `resultsDir`                 | Results directory                                         | `path.join(process.cwd(), 'performance-results')` |
| `significantChangeThreshold` | Threshold for significant performance change (percentage) | `5`                                               |
| `iterations`                 | Number of iterations for each benchmark                   | `5`                                               |
| `warmupIterations`           | Warmup iterations before measuring                        | `2`                                               |
| `timeout`                    | Timeout for each benchmark (ms)                           | `30000`                                           |

## API Reference

### `PerformanceAnalyzer`

#### `constructor(options)`

Creates a new `PerformanceAnalyzer` instance.

- `options` (Object): Configuration options

#### `analyzeFile(filePath, options)`

Analyzes the performance impact of a file.

- `filePath` (string): Path to the file to analyze
- `options` (Object): Analysis options
- Returns: Promise<Object> - Analysis result

## Example Output

```
# Performance Impact Analysis for MyFile.js

## Overall Impact: ✅ Positive (Performance Improved)

## Benchmark Results

### myFunction-case1

Benchmark for myFunction with case 1

| Metric | Current | Previous | Change |
| ------ | ------- | -------- | ------ |
| Duration | 10.50ms | 12.00ms | ✅ -12.50% |
| Memory Usage | 1.00MB | 1.10MB | ✅ -9.09% |

### myFunction-case2

Benchmark for myFunction with case 2

| Metric | Current | Previous | Change |
| ------ | ------- | -------- | ------ |
| Duration | 15.20ms | 14.80ms | 2.70% |
| Memory Usage | 1.50MB | 1.48MB | 1.35% |
```

## License

This module is part of the Quantum-Unified Database package and is licensed under the same terms.
