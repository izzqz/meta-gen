const defaultValues = {
    name: 'John Doe',
    email: 'john@example.com',
    url: 'http://example.com',
    image: 'http://example.com/image.jpeg'
}

const getTemplate = () =>
    fetch("template/template.ejs")
        .then((res) => res.text())
        // .then(updateOutput)
        .catch((err) => {
            throw err;
        });

const output = document.getElementById("output");
const inputIds = ["name", "email", "url"];
const template = getTemplate();

const getValues = () => {
    let values = {};
    for (const id of inputIds) {
        values[id] = document.getElementById(id).value;
    }
    return values;
};

async function updateOutput() {
    const { name, email, url, image } = getValues();

    const xml = ejs.render(await template, {
        name: name || defaultValues.name,
        email: email || defaultValues.email,
        url: url || defaultValues.url,
        image: image || defaultValues.description,
        description: `${name}'s Resume`,
        title: `${name}'s Resume`,
    }, {});

    output.innerHTML = hljs.highlight(xml, {language: 'xml'}).value
}

for (const id of inputIds) {
    document.getElementById(id).addEventListener('input', updateOutput);
}

updateOutput();