const webpack = require("webpack");
const options = require("recharts/demo/webpack.config.js");

const compiler = webpack(options);

function generateStats(result, stat) {
    const {errors, warnings} = stat.toJson('errors-warnings');
    if (errors.length > 0) {
        result.errors.push(...errors);
    }
    if (warnings.length > 0) {
        result.warnings.push(...warnings);
    }
    return result;
}

compiler.run((err,statsOrMultiStats) => {
    if (err) {
        return err;
    }
    if ('stats'in statsOrMultiStats) {
        const result = statsOrMultiStats.stats.reduce(generateStats, {
            errors: [],
            warnings: []
        });
        return result;
    }
    const result = generateStats({
        errors: [],
        warnings: []
    }, statsOrMultiStats);

    console.log(result.errors.join(""));
});