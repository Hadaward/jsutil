/// <reference path="csstype.d.ts"/>

function camelToSnake(string = '') {
    return string
        .replace(/([A-Z])/g, (_, group) => `-${group.toLowerCase()}`)
        .replace(/^-/, '');
}

async function style2Rule(selector, style, state) {
    let rule = `${selector} {`;

    const pseudoStyles = [];

    for (const [key, value] of Object.entries(style)) {
        if (key.startsWith(":") && typeof value === "object") {
            pseudoStyles.push([selector + key, value, state]);
            continue;
        }
        let computed = value;
        
        if (typeof value === 'function') {
            try {
                computed = await value(style, state);
            } catch(error) {
                console.error(error);
            }
        }

        rule += `${camelToSnake(key)}: ${computed};`;
    }

    rule += '}';

    const rules = [];

    if (rule !== `${selector} {}`) {
        rules.push(rule);
    }

    for (const pseudo of pseudoStyles) {
       rules.push(...await style2Rule(...pseudo));
    }

    return rules;
}

/**
 * @typedef {CSSType.Properties | {[K in keyof CSSType.Properties]: (style: CSSProperties<T>, state: T) => CSSType.Properties[K]}} CSSProperties
 * @template T
 */

/**
 * Método auxiliar para aplicar estilos a elementos HTML usando JavaScript e meta-propriedades.
 * @template T
 * @param {string} name - Nome do estilo no data-style
 * @param {CSSProperties<T> | {[K in CSSType.Pseudos]: CSSProperties<T>}} style - Um objeto contendo estilos CSS.
 * @param {T} state - Um objeto contendo variáveis que podem ser acessadas em métodos de propriedade
 */
export function useStyle(name, style, state = {}) {
    const stylesheet = new CSSStyleSheet();

    document.adoptedStyleSheets.push(stylesheet);

    const refresh = async () => {
        const rules = await style2Rule(`* [data-style*=${name}]`, style, state);

        if (stylesheet.cssRules.length > 0) {
            while (stylesheet.cssRules.length > 0)
                stylesheet.deleteRule(0);
        }
            
        for (let idx = 0; idx < rules.length; idx ++)
            stylesheet.insertRule(rules[idx], idx);
    }

    refresh();
    return { refresh };
}