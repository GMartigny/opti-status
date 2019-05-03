const test = require("ava");
const opti = require("../");

test("Optimizable", (t) => {
    const fn = () => "ok";

    const res = opti(fn);
    t.is(res.status, 49);
    t.is(res.function, fn);
    t.is(res.message.includes("optimized"));
});

test("Unoptimizable", (t) => {
    const fn = () => {
        try {
            if (Math.random()) {
                throw new Error("");
            }
            return "ok";
        }
        catch (e) {
            return "throws";
        }
    };

    const res = opti(fn);
    t.is(res.status, 49);
    t.is(res.function, fn);
    t.is(res.message.includes("optimized"));
});
