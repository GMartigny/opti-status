/* eslint-disable no-bitwise */
const test = require("ava");
const opti = require("..");

test("Optimizable", (t) => {
    const fn = () => "ok";

    const res = opti(fn);
    t.true((res.status & opti.statuses.isOptimized) !== 0);
    t.is(res.function, fn);
    t.true(res.message.includes("optimized"));
});
