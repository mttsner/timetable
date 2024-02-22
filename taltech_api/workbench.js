const { search } = require('./search');
const { get_ical } = require('./get_ical');

(async () => {
    const raw_subjects = await search("");
    let subject_ids = {};
    raw_subjects.forEach(subject => subject_ids[subject[1]] = subject[0]);

    console.log(subject_ids);

    const repl = require('repl');
    const replServer = repl.start({
        prompt: "SWP > ",
        useGlobal: true,
    });
    
    replServer.context.search = search;
    replServer.context.get_ical = (async (code) => await get_ical(code, subject_ids[code]));

})();
