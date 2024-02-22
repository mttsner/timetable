const { search } = require('./search');
const { ical } = require('./ical');

const repl = require('repl');
const replServer = repl.start({
    prompt: "SWP > ",
    useGlobal: true,
});

replServer.context.search = search;
replServer.context.ical = ical;