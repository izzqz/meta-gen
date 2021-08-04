/**
 *
 */
const DEFAULT_VALUES = {
    name: "John Doe",
    email: "john@example.com",
    url: "http://example.com/resume",
    image: "http://example.com/image.jpeg",
    description: "---", // Proxy target
};

/**
 * 
 */
const defaultValuesHandler = {
    get: function (target, prop, receiver) {
        if (prop === "description") {
            const name = getValues("name");
            let defaultValue;

            if (name) {
                defaultValue = `${name}'s Resume`; // Based on user's "name"
            }
            if (!name) {
                defaultValue =`${target.name}'s Resume`; // Based on default "name"
            }

            document.getElementById("description").placeholder = defaultValue;
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

    const xml = ejs.render(await template, values, {});

    output.innerHTML = hljs.highlight(xml, { language: "xml" }).value;
}

for (const id of inputIds) {
    const el = document.getElementById(id);
    el.addEventListener("input", updateOutput);
    el.placeholder = defaultValues[id];
}

updateOutput();
