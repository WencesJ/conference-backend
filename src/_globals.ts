import logger from './logger';

const base_dir = __dirname;

const abs_path = function (path: string) {
    return base_dir + path;
};

const _logger = logger;

Object.defineProperty(global, '_logger', {
    value: logger,
    writable: false,
    configurable: false,
});