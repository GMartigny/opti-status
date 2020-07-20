const { prepareFunctionForOptimization, optimizeFunctionOnNextCall, getOptimizationStatus } = require("v8.js");

const statuses = {
    isFunction: 2 ** 0,
    isNeverOptimize: 2 ** 1,
    isAlwaysOptimize: 2 ** 2,
    isMaybeDeopted: 2 ** 3,
    isOptimized: 2 ** 4,
    isTurboFanned: 2 ** 5,
    isInterpreted: 2 ** 6,
    isMarkedForOptimization: 2 ** 7,
    isMarkedForConcurrentOptimization: 2 ** 8,
    isOptimizingConcurrently: 2 ** 9,
    isExecuting: 2 ** 10,
    isTopmostFrameTurboFanned: 2 ** 11,
    isLiteMode: 2 ** 12,
};

const messages = {
    [statuses.isFunction]: "a function",
    [statuses.isNeverOptimize]: "never optimized",
    [statuses.isAlwaysOptimize]: "always optimized",
    [statuses.isMaybeDeopted]: "maybe de-optimized",
    [statuses.isOptimized]: "optimized",
    [statuses.isTurboFanned]: "turbo-fanned",
    [statuses.isInterpreted]: "interpreted",
    [statuses.isMarkedForOptimization]: "marked for optimization",
    [statuses.isMarkedForConcurrentOptimization]: "marked for concurrent optimization",
    [statuses.isOptimizingConcurrently]: "currently being optimized",
    [statuses.isExecuting]: "executing",
    [statuses.isTopmostFrameTurboFanned]: "the topmost frame is turbo-fanned",
    [statuses.isLiteMode]: "in lite mode",
};
const defaultMessage = "Unknown optimization status.";

const getMessage = (status = -1) => {
    if (status > 0) {
        const separator = ", ";
        const final = " and ";
        const message = status.toString(2)
            .split("")
            .reverse()
            .map((on, i) => on === "1" && messages[2 ** i])
            .filter(x => x);
        const messageString = message.slice(0, -1).join(separator) + final + message.slice(-1)[0];

        return `This is ${messageString}.`;
    }
    if (status === 0) {
        return "This is not a function.";
    }

    return defaultMessage;
};

const safe = (func, ...funcArgs) => {
    try {
        func(...funcArgs);
    }
    catch {
        // Nothing to do here
    }
};

const prepareFunction = (func, ...funcArgs) => {
    let exe;
    const type = typeof func;
    if (type === "function") {
        exe = func;
    }
    else if (type === "string") {
        // eslint-disable-next-line no-new-func
        exe = new Function(...funcArgs, func);
    }
    else {
        throw new TypeError(`Cannot parse type [${type}] to a function.`);
    }

    safe(exe, ...funcArgs);
    safe(exe, ...funcArgs);
    prepareFunctionForOptimization(exe);
    optimizeFunctionOnNextCall(exe);
    // The next call
    safe(exe, ...funcArgs);
    return exe;
};

/**
 * @typedef {Object} OptimizationStatus
 * @prop {Number} status - V8 optimization status number
 * @prop {Function} function - Passed function for future reference
 * @prop {String} message - Optimization status as a human readable format
 */
/**
 * Get the optimization status of a function from the point of view of V8
 * @param {Function|String} func - Function to get optimization status from
 * @param {...*} funcArgs - Set of arguments used when calling `func`
 * @returns {OptimizationStatus}
 */
module.exports = (func, ...funcArgs) => {
    const exe = prepareFunction(func, ...funcArgs);

    const status = getOptimizationStatus(exe);

    return {
        status,
        function: exe,
        message: getMessage(status),
    };
};

module.exports.statuses = statuses;
