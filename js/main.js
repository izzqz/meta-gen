/**
 * How
 * 
 */
const DEFAULT_VALUES = {
    name: "John Doe",
    url: "http://example.com/resume",
    image: "http://example.com/image.jpeg",
    description: "---", // Proxy target
    title: "---", // Proxy target
    
    // json-ld stuff
    jobTitle: "Frontend Developer",
    email: "john@example.com"
};

/**
 * 
 */
const defaultValuesHandler = {
    get: function (target, prop, receiver) {
        if (["description", "title"].includes(prop)) {
            const name = getValues("name");
            let defaultValue;

            if (name) {
                defaultValue = `${name}'s Resume`; // Based on user's "name"
            }
            if (!name) {
                defaultValue = `${target.name}'s Resume`; // Based on default "name"
            }

            document.getElementById(prop).placeholder = defaultValue;
            return defaultValue;
        }

        return Reflect.get(...arguments);
    },
};

const defaultValues = new Proxy(DEFAULT_VALUES, defaultValuesHandler);

/**
 * Fetches template
 * @returns {string}
 */
const getTemplate = () =>
    fetch("template/template.ejs")
        .then((res) => res.text())
        .catch((err) => {
            throw err;
        });

const output = document.getElementById("output");
const inputIds = Object.keys(DEFAULT_VALUES);
const template = getTemplate();

const getValues = (id) => {
    if (id) {
        return document.getElementById(id).value;
    }

    let values = {};
    for (const id of inputIds) {
        values[id] = document.getElementById(id).value || defaultValues[id];
    }
    return values;
};

async function updateOutput() {
    const values = getValues();

    const xml = ejs.render(
        await template,
        Object.assign(values, { defaultValues }),
        {}
    );

    output.innerHTML = hljs.highlight(xml, { language: "xml" }).value
}

(function main() {
    for (const id of inputIds) {
        const el = document.getElementById(id);
        el.addEventListener("input", updateOutput);
        el.placeholder = defaultValues[id];
    }

    updateOutput();
})();
