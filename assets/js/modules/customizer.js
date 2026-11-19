const STORAGE_KEY = 'teply-krug:customizer:v1';
const FORMAT_VERSION = 1;
const LANDING_SELECTOR = '.landing';
const FONTS = {
    original: { label: 'Исходные шрифты', css: null },
    golos: {
        label: 'Golos Text · 400–900',
        css: "'Golos Text', Arial, sans-serif",
        min: 400,
        max: 900,
        step: 1,
    },
    prata: {
        label: 'Prata · 400',
        css: "'Prata', Georgia, serif",
        min: 400,
        max: 400,
        step: 1,
    },
    arial: {
        label: 'Arial · 400 / 700',
        css: 'Arial, sans-serif',
        min: 400,
        max: 700,
        step: 300,
    },
    georgia: {
        label: 'Georgia · 400 / 700',
        css: 'Georgia, serif',
        min: 400,
        max: 700,
        step: 300,
    },
    verdana: {
        label: 'Verdana · 400 / 700',
        css: 'Verdana, sans-serif',
        min: 400,
        max: 700,
        step: 300,
    },
};

function number(id, label, variable, initial, min, max, step, unit = '', divisor = 1, extra = {}) {
    return {
        id,
        label,
        type: 'number',
        variable,
        initial,
        min,
        max,
        step,
        unit,
        divisor,
        ...extra,
    };
}

function color(id, label, variable, extra = {}) {
    return { id, label, type: 'color', variable, unit: '', ...extra };
}

function typeGroup(
    prefix,
    label,
    size,
    variable,
    min,
    max,
    weight,
    lineHeight,
    tracking,
    fontRole,
) {
    const fields = [
        number(
            `${prefix}Size`,
            'Размер',
            variable,
            size,
            min,
            max,
            0.1,
            'px',
            prefix === 'body' ? 1 : size,
        ),
        number(
            `${prefix}Weight`,
            'Насыщенность',
            `--type-${prefix}-weight`,
            weight,
            400,
            900,
            1,
            '',
            1,
            { fontRole },
        ),
        number(
            `${prefix}LineHeight`,
            'Межстрочный интервал',
            `--type-${prefix}-line-height`,
            lineHeight,
            0.9,
            2.4,
            0.01,
        ),
    ];
    if (tracking !== null)
        fields.push(
            number(
                `${prefix}Tracking`,
                'Межбуквенный интервал',
                `--type-${prefix}-tracking`,
                tracking,
                -0.09,
                0.15,
                0.001,
                'em',
            ),
        );
    return { label, fields };
}

function shadowGroup(prefix, label, variable) {
    return {
        label,
        fields: [
            number(
                `${prefix}ShadowX`,
                'Тень: сдвиг по горизонтали',
                `--${variable}-shadow-x`,
                0,
                -24,
                24,
                1,
                'px',
            ),
            number(
                `${prefix}ShadowY`,
                'Тень: сдвиг по вертикали',
                `--${variable}-shadow-y`,
                0,
                -24,
                40,
                1,
                'px',
            ),
            number(
                `${prefix}ShadowBlur`,
                'Тень: размытие',
                `--${variable}-shadow-blur`,
                0,
                0,
                64,
                1,
                'px',
            ),
            number(
                `${prefix}ShadowOpacity`,
                'Тень: непрозрачность',
                `--${variable}-shadow-opacity`,
                0,
                0,
                60,
                1,
                '%',
                100,
            ),
        ],
    };
}

// One parameter registry drives controls, validation, state, presets, reset and CSS.
const SECTIONS = [
    {
        id: 'colors',
        label: 'Цвета',
        groups: [
            {
                label: 'Палитра и поверхности',
                fields: [
                    color('primary', 'Основной цвет', '--color-coffee'),
                    color('secondary', 'Дополнительный цвет', '--color-apricot'),
                    color('accent', 'Акцент', '--color-accent'),
                    color('background', 'Фон страницы', '--color-bg'),
                    color('surface', 'Фон поверхностей и карточек', '--color-surface', {
                        aliases: ['--coffee-card-accent-bg', '--coffee-card-last-bg'],
                    }),
                    color('text', 'Основной текст', '--color-text'),
                    color('muted', 'Приглушённый текст', '--color-muted'),
                    color('links', 'Ссылки', '--text-link-color', {
                        aliases: ['--site-header-link-color'],
                    }),
                    color('borders', 'Границы', '--color-line', {
                        aliases: ['--menu-tab-border'],
                    }),
                ],
            },
            {
                label: 'Основные кнопки',
                fields: [
                    color('buttonBackground', 'Фон основной кнопки', '--button-bg', {
                        dark: true,
                        aliases: [
                            '--button-border',
                            '--button-active-bg',
                            '--button-active-border',
                        ],
                    }),
                    color('buttonText', 'Текст основной кнопки', '--button-color', {
                        dark: true,
                        aliases: ['--button-active-color'],
                    }),
                    color('buttonHover', 'Фон при наведении', '--button-hover-bg', {
                        dark: true,
                        aliases: ['--button-hover-border'],
                    }),
                    color('buttonHoverText', 'Текст при наведении', '--button-hover-color', {
                        dark: true,
                    }),
                ],
            },
            {
                label: 'Вторичные кнопки · вкладки меню',
                fields: [
                    color('secondaryBackground', 'Фон вторичной кнопки', '--menu-tab-bg', {
                        transparent: true,
                    }),
                    color('secondaryText', 'Текст вторичной кнопки', '--menu-tab-color'),
                    color('secondaryHover', 'Фон при наведении', '--menu-tab-hover-bg'),
                    color('secondaryHoverText', 'Текст при наведении', '--menu-tab-hover-color'),
                ],
            },
        ],
    },
    {
        id: 'typography',
        label: 'Типографика',
        hint: 'Размеры H1 и H2–H3 указаны для широкого экрана. Мобильные размеры и пропорции подзаголовков меняются вместе с ними. «Исходные шрифты»: H1 — Prata, H2 — Golos Text.',
        groups: [
            {
                label: 'Семейства',
                fields: [
                    {
                        id: 'headingFont',
                        label: 'Шрифт заголовков',
                        type: 'font',
                        variable: '--font-heading',
                        initial: 'original',
                        unit: '',
                        aliases: ['--font-title', '--font-heading-secondary'],
                    },
                    {
                        id: 'bodyFont',
                        label: 'Шрифт основного текста',
                        type: 'font',
                        variable: '--font-body',
                        initial: 'original',
                        unit: '',
                    },
                ],
            },
            typeGroup(
                'h1',
                'H1 · первый экран',
                128,
                '--type-h1-scale',
                64,
                180,
                400,
                1.02,
                -0.065,
                'heading',
            ),
            typeGroup(
                'heading',
                'H2–H3 · заголовки разделов',
                72,
                '--type-heading-scale',
                36,
                96,
                650,
                1.06,
                -0.055,
                'heading',
            ),
            typeGroup('body', 'Абзацы', 16, '--font-size-body', 14, 24, 400, 1.65, null, 'body'),
            typeGroup(
                'small',
                'Мелкий текст',
                14,
                '--type-small-scale',
                12,
                20,
                400,
                1.5,
                null,
                'body',
            ),
            typeGroup(
                'button',
                'Надписи на кнопках',
                14,
                '--type-button-scale',
                12,
                20,
                500,
                1.5,
                0,
                'body',
            ),
            {
                label: 'Длина строки',
                fields: [
                    number(
                        'textWidth',
                        'Максимальная ширина текста',
                        '--text-max-width',
                        1200,
                        240,
                        1200,
                        1,
                        'px',
                    ),
                ],
            },
        ],
    },
    {
        id: 'components',
        label: 'Компоненты',
        hint: 'Отступы сохраняют пропорции компактных кнопок, вкладок и мобильных карточек. У теней исходная непрозрачность 0%.',
        groups: [
            {
                label: 'Кнопки',
                fields: [
                    number('buttonRadius', 'Скругление', '--button-radius', 12, 0, 999, 1, 'px'),
                    number(
                        'buttonPaddingX',
                        'Отступ по горизонтали',
                        '--button-padding-x-scale',
                        24,
                        8,
                        40,
                        1,
                        'px',
                        24,
                    ),
                    number(
                        'buttonPaddingY',
                        'Отступ по вертикали',
                        '--button-padding-y-scale',
                        8,
                        4,
                        24,
                        1,
                        'px',
                        8,
                    ),
                    number(
                        'buttonBorder',
                        'Толщина границы',
                        '--button-border-width',
                        1,
                        0,
                        6,
                        1,
                        'px',
                    ),
                ],
            },
            shadowGroup('button', 'Тень кнопок', 'button'),
            {
                label: 'Карточки кофе домой',
                fields: [
                    number('cardRadius', 'Скругление', '--coffee-card-radius', 14, 0, 64, 1, 'px'),
                    number(
                        'cardPadding',
                        'Внутренний отступ',
                        '--coffee-card-padding-scale',
                        32,
                        12,
                        56,
                        1,
                        'px',
                        32,
                    ),
                    number(
                        'cardBorder',
                        'Толщина границы',
                        '--coffee-card-border-width',
                        0,
                        0,
                        6,
                        1,
                        'px',
                    ),
                ],
            },
            shadowGroup('card', 'Тень карточек', 'coffee-card'),
        ],
    },
    {
        id: 'layout',
        label: 'Сетка и эффекты',
        hint: 'Поля и секционные отступы сохраняют мобильные пропорции. При уменьшении движения в системе переходы отключаются.',
        groups: [
            {
                label: 'Сетка',
                fields: [
                    number(
                        'containerWidth',
                        'Максимальная ширина контейнера',
                        '--container-width',
                        1280,
                        960,
                        1600,
                        1,
                        'px',
                    ),
                    number(
                        'gutter',
                        'Боковые поля',
                        '--layout-gutter-scale',
                        48,
                        28,
                        80,
                        1,
                        'px',
                        48,
                    ),
                    number(
                        'sectionSpace',
                        'Вертикальный отступ секций',
                        '--layout-section-scale',
                        96,
                        60,
                        180,
                        1,
                        'px',
                        96,
                    ),
                    number(
                        'gridGap',
                        'Расстояния в сетке',
                        '--layout-gap-scale',
                        100,
                        50,
                        160,
                        1,
                        '%',
                        100,
                    ),
                    number(
                        'duration',
                        'Длительность переходов',
                        '--transition-duration',
                        260,
                        0,
                        800,
                        10,
                        'ms',
                    ),
                ],
            },
        ],
    },
];
const PARAMETERS = SECTIONS.flatMap((section) =>
    section.groups.flatMap((group) =>
        group.fields.map((field) => ({ ...field, section: section.id })),
    ),
);
const PRESETS = {
    original: {},
    compact: {
        h1Size: 96,
        headingSize: 56,
        cardPadding: 24,
        sectionSpace: 84,
        gridGap: 80,
        buttonPaddingY: 6,
    },
    airy: {
        sectionSpace: 156,
        gridGap: 125,
        cardPadding: 40,
        bodyLineHeight: 1.85,
        textWidth: 560,
        gutter: 64,
    },
    contrast: {
        primary: '#28121d',
        text: '#28121d',
        muted: '#54333d',
        accent: '#81252b',
        buttonBackground: '#81252b',
        buttonText: '#fff9ef',
        buttonHover: '#5c1521',
        buttonHoverText: '#fff9ef',
        borders: '#95695f',
        secondaryText: '#28121d',
    },
};

function normalizeColor(value, transparent = false) {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim().toLowerCase();
    if (transparent && trimmed === 'transparent') return trimmed;
    if (/^#[\da-f]{6}$/.test(trimmed)) return trimmed;
    if (/^#[\da-f]{3}$/.test(trimmed))
        return '#' + [...trimmed.slice(1)].map((char) => char + char).join('');
    return null;
}

function weightRange(parameter, state) {
    if (!parameter.fontRole) return parameter;
    const selected = state[`${parameter.fontRole}Font`];
    return FONTS[selected === 'original' ? 'golos' : selected];
}

function validValue(parameter, value, state) {
    if (parameter.type === 'color') return normalizeColor(value, parameter.transparent);
    if (parameter.type === 'font') return Object.hasOwn(FONTS, value) ? value : null;
    const range = weightRange(parameter, state);
    if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        value < range.min ||
        value > range.max
    )
        return null;
    const steps = (value - range.min) / range.step;
    return Math.abs(steps - Math.round(steps)) < 0.00001 ? value : null;
}

function cssValue(parameter, value) {
    if (parameter.type === 'font') return FONTS[value].css;
    if (parameter.type === 'color') return value;
    const unit = parameter.divisor !== 1 ? '' : parameter.unit;
    return `${Number((value / parameter.divisor).toFixed(6))}${unit === '%' ? '' : unit}`;
}

function makeCss(state, defaults) {
    const declarations = [];
    const darkDeclarations = [];
    for (const parameter of PARAMETERS) {
        const forcedWeight =
            parameter.fontRole && state[`${parameter.fontRole}Font`] !== 'original';
        if (
            state[parameter.id] === defaults[parameter.id] &&
            !state.overrides.includes(parameter.id) &&
            !forcedWeight
        )
            continue;
        const value = cssValue(parameter, state[parameter.id]);
        if (value === null) continue;
        const lines = [parameter.variable, ...(parameter.aliases || [])].map(
            (variable) => `    ${variable}: ${value};`,
        );
        declarations.push(...lines);
        if (parameter.dark) darkDeclarations.push(...lines);
    }
    const blocks = [];
    if (declarations.length) blocks.push(`${LANDING_SELECTOR} {\n${declarations.join('\n')}\n}`);
    if (darkDeclarations.length)
        blocks.push(`${LANDING_SELECTOR} .dark-mode {\n${darkDeclarations.join('\n')}\n}`);
    return blocks.join('\n\n');
}

function findPreviewSheet(sheets) {
    for (const sheet of sheets) {
        if (sheet.href?.endsWith('/utils/customizer-preview.css')) return sheet;
        for (const rule of sheet.cssRules) {
            if (rule.styleSheet) {
                const found = findPreviewSheet([rule.styleSheet]);
                if (found) return found;
            }
        }
    }
    return null;
}

function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
}

function createField(parameter, defaults) {
    const wrapper = element('div', 'customizer__field');
    const inputId = `customizer-${parameter.id}`;
    const label = element('label', 'customizer__field-label', parameter.label);
    label.htmlFor = inputId;
    wrapper.append(label);
    const input = element(
        parameter.type === 'font' ? 'select' : 'input',
        parameter.type === 'font' ? 'customizer__select' : 'customizer__input',
    );
    input.id = inputId;
    input.dataset.parameter = parameter.id;
    input.value = defaults[parameter.id];
    const row = element('div', 'customizer__row');
    let auxiliary;
    if (parameter.type === 'font') {
        for (const [value, font] of Object.entries(FONTS)) {
            const option = element('option', '', font.label);
            option.value = value;
            input.append(option);
        }
    } else {
        input.type = parameter.type === 'color' ? 'text' : 'number';
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.setAttribute('aria-describedby', `${inputId}-error`);
        auxiliary = element(
            'input',
            parameter.type === 'color' ? 'customizer__color' : 'customizer__range',
        );
        auxiliary.type = parameter.type === 'color' ? 'color' : 'range';
        auxiliary.dataset.parameter = parameter.id;
        auxiliary.dataset.auxiliary = '';
        auxiliary.setAttribute('aria-labelledby', `${inputId}-label`);
        label.id = `${inputId}-label`;
        if (parameter.type === 'color') {
            input.classList.add('customizer__input--hex');
            input.maxLength = parameter.transparent ? 11 : 7;
            input.setAttribute(
                'aria-label',
                `${parameter.label}, HEX${parameter.transparent ? ' или transparent' : ''}`,
            );
        } else {
            input.inputMode = 'decimal';
        }
        row.append(auxiliary);
    }
    row.append(input);
    if (parameter.unit) row.append(element('span', 'customizer__unit', parameter.unit));
    wrapper.append(row);
    const error = element('p', 'customizer__error');
    error.id = `${inputId}-error`;
    error.hidden = true;
    wrapper.append(error);
    return { wrapper, input, auxiliary, error };
}

function createSections(container, defaults) {
    const controls = new Map();
    const fragment = document.createDocumentFragment();
    for (const section of SECTIONS) {
        const details = element('details', 'customizer__section');
        details.open = section.id === 'colors';
        details.append(element('summary', 'customizer__summary', section.label));
        const content = element('div', 'customizer__section-content');
        if (section.hint) content.append(element('p', 'customizer__hint', section.hint));
        for (const group of section.groups) {
            const fieldset = element('fieldset', 'customizer__group');
            fieldset.append(element('legend', 'customizer__legend', group.label));
            for (const field of group.fields) {
                const parameter = PARAMETERS.find((item) => item.id === field.id);
                const control = createField(parameter, defaults);
                controls.set(parameter.id, control);
                fieldset.append(control.wrapper);
            }
            content.append(fieldset);
        }
        if (section.id === 'colors') {
            const contrast = element('div', 'customizer__contrast');
            contrast.dataset.customizerContrast = '';
            content.append(contrast);
            content.append(
                element(
                    'p',
                    'customizer__hint',
                    'Для обычного текста ориентир — 4,5:1. Низкий контраст не ограничивает эксперименты. Для прозрачного фона кнопки можно ввести transparent.',
                ),
            );
        }
        const reset = element('button', 'customizer__reset-section', 'Сбросить раздел');
        reset.type = 'button';
        reset.dataset.customizerSectionReset = section.id;
        reset.setAttribute('aria-label', `Сбросить раздел «${section.label}»`);
        content.append(reset);
        details.append(content);
        fragment.append(details);
    }
    container.append(fragment);
    return controls;
}

function luminance(color) {
    const channels = color
        .match(/[\d.]+/g)
        ?.slice(0, 3)
        .map(Number);
    if (!channels || channels.length !== 3) return null;
    const values = channels
        .map((channel) => channel / 255)
        .map((channel) =>
            channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
        );
    return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

function effectiveBackground(node) {
    while (node) {
        const color = getComputedStyle(node).backgroundColor;
        if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') return color;
        node = node.parentElement;
    }
    return 'rgb(255, 255, 255)';
}

function updateContrast(container, landing) {
    const pairs = [
        ['Текст на фоне страницы', landing],
        ['Основная кнопка', landing.querySelector('[data-customizer-sample="primary"]')],
        ['Кнопка в тёмной секции', landing.querySelector('[data-customizer-sample="dark-button"]')],
        ['Вторичная кнопка', landing.querySelector('[data-menu-tab][aria-selected="false"]')],
    ];
    const fragment = document.createDocumentFragment();
    for (const [label, node] of pairs) {
        if (!node) continue;
        const foreground = luminance(getComputedStyle(node).color);
        const background = luminance(effectiveBackground(node));
        if (foreground === null || background === null) continue;
        const ratio =
            (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
        fragment.append(
            element(
                'p',
                ratio < 4.5 ? 'is-low' : '',
                `${label}: ${ratio.toFixed(2)}:1 · ${ratio < 4.5 ? 'низкий контраст' : 'достаточный контраст'}`,
            ),
        );
    }
    container.replaceChildren(fragment);
}

export function initCustomizer() {
    const landing = document.querySelector('[data-landing]');
    const panel = document.querySelector('[data-customizer]');
    const trigger = document.querySelector('[data-customizer-open]');
    if (!landing || !panel || !trigger) return;
    const previewSheet = findPreviewSheet(document.styleSheets);
    if (!previewSheet) return;
    const sourceStyle = getComputedStyle(landing);
    const defaults = Object.fromEntries(
        PARAMETERS.map((parameter) => [
            parameter.id,
            parameter.type === 'color'
                ? normalizeColor(
                      sourceStyle.getPropertyValue(parameter.variable),
                      parameter.transparent,
                  )
                : parameter.initial,
        ]),
    );
    let state = { ...defaults, overrides: [] };
    const status = panel.querySelector('[data-customizer-status]');
    const body = panel.querySelector('[data-customizer-body]');
    const preset = panel.querySelector('[data-customizer-preset]');
    const exportBox = panel.querySelector('[data-customizer-export]');
    const exportField = panel.querySelector('[data-customizer-css]');
    const controls = createSections(panel.querySelector('[data-customizer-sections]'), defaults);
    const contrast = panel.querySelector('[data-customizer-contrast]');
    let storageAvailable = true;
    let contrastFrame = 0;

    function say(message) {
        status.textContent = message;
    }

    function save() {
        const changes = Object.fromEntries(
            PARAMETERS.filter(
                (parameter) =>
                    state[parameter.id] !== defaults[parameter.id] ||
                    state.overrides.includes(parameter.id),
            ).map((parameter) => [parameter.id, state[parameter.id]]),
        );
        try {
            if (Object.keys(changes).length)
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({
                        version: FORMAT_VERSION,
                        values: changes,
                    }),
                );
            else localStorage.removeItem(STORAGE_KEY);
            storageAvailable = true;
            say(
                Object.keys(changes).length
                    ? 'Настройки сохранены в этом браузере.'
                    : 'Исходный дизайн. Можно менять любой параметр.',
            );
        } catch {
            storageAvailable = false;
            say('Хранилище недоступно. Настройки действуют до перезагрузки.');
        }
    }

    function syncControls(source = null) {
        for (const parameter of PARAMETERS) {
            const control = controls.get(parameter.id);
            const value =
                parameter.type === 'color' && !state.overrides.includes(parameter.id)
                    ? (normalizeColor(
                          getComputedStyle(landing).getPropertyValue(parameter.variable),
                          parameter.transparent,
                      ) ?? state[parameter.id])
                    : state[parameter.id];
            if (control.input !== source) {
                control.input.value = value;
                control.input.removeAttribute('aria-invalid');
                control.error.hidden = true;
            }
            if (control.auxiliary) {
                control.auxiliary.value =
                    parameter.type === 'color'
                        ? value === 'transparent'
                            ? '#fff9ef'
                            : value
                        : value;
                if (parameter.type === 'number') {
                    const range = weightRange(parameter, state);
                    for (const input of [control.input, control.auxiliary]) {
                        input.min = range.min;
                        input.max = range.max;
                        input.step = range.step;
                        input.disabled = range.min === range.max;
                    }
                    // Setting min/max can clamp a range. Set the state value last.
                    control.auxiliary.value = value;
                }
            }
        }
        const matchingPreset = Object.entries(PRESETS).find(([, values]) =>
            PARAMETERS.every(
                (parameter) =>
                    state[parameter.id] === (values[parameter.id] ?? defaults[parameter.id]),
            ),
        );
        preset.value =
            matchingPreset?.[0] === 'original' && state.overrides.length
                ? 'custom'
                : matchingPreset?.[0] || 'custom';
    }

    function render(source = null, persist = true) {
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        const panelScroll = body.scrollTop;
        const css = makeCss(state, defaults);
        while (previewSheet.cssRules.length) previewSheet.deleteRule(0);
        for (const block of css.match(/[^{}]+\{[^{}]*\}/g) || [])
            previewSheet.insertRule(block, previewSheet.cssRules.length);
        syncControls(source);
        exportField.value = css || '/* Исходный дизайн: переопределений нет. */';
        window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
        body.scrollTop = panelScroll;
        cancelAnimationFrame(contrastFrame);
        contrastFrame = requestAnimationFrame(() => updateContrast(contrast, landing));
        if (persist) save();
    }

    function constrainWeights() {
        for (const parameter of PARAMETERS.filter((item) => item.fontRole)) {
            const range = weightRange(parameter, state);
            const value = Math.min(range.max, Math.max(range.min, state[parameter.id]));
            state[parameter.id] =
                range.min + Math.round((value - range.min) / range.step) * range.step;
        }
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const saved = JSON.parse(raw);
            if (
                saved?.version !== FORMAT_VERSION ||
                !saved.values ||
                typeof saved.values !== 'object' ||
                Array.isArray(saved.values)
            )
                throw new Error('Invalid format');
            // Families must be validated before their supported weights.
            for (const parameter of [...PARAMETERS].sort(
                (left, right) => Number(right.type === 'font') - Number(left.type === 'font'),
            )) {
                if (!Object.hasOwn(saved.values, parameter.id)) continue;
                const value = validValue(parameter, saved.values[parameter.id], state);
                if (value !== null) {
                    state[parameter.id] = value;
                    state.overrides.push(parameter.id);
                }
            }
            constrainWeights();
            say('Сохранённые настройки восстановлены.');
        } else say('Исходный дизайн. Можно менять любой параметр.');
    } catch {
        state = { ...defaults, overrides: [] };
        say('Сохранённые настройки недоступны. Открыт исходный дизайн.');
    }
    render(null, false);
    trigger.hidden = false;

    function close() {
        panel.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus({ preventScroll: true });
    }
    trigger.addEventListener('click', () => {
        panel.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        panel.querySelector('[data-customizer-close]').focus({ preventScroll: true });
        updateContrast(contrast, landing);
    });
    panel.querySelector('[data-customizer-close]').addEventListener('click', close);
    document.addEventListener(
        'keydown',
        (event) => {
            if (event.key !== 'Escape' || panel.hidden || event.defaultPrevented) return;
            event.preventDefault();
            event.stopImmediatePropagation();
            close();
        },
        true,
    );

    panel.addEventListener('input', (event) => {
        const input = event.target.closest('[data-parameter]');
        if (!input || event.isComposing) return;
        const parameter = PARAMETERS.find((item) => item.id === input.dataset.parameter);
        const control = controls.get(parameter.id);
        const candidate =
            parameter.type === 'number'
                ? input.value.trim() === ''
                    ? null
                    : Number(input.value)
                : input.value;
        const value = validValue(parameter, candidate, state);
        if (value === null) {
            const range = weightRange(parameter, state);
            control.input.setAttribute('aria-invalid', 'true');
            control.error.textContent =
                parameter.type === 'color'
                    ? 'Введи HEX: #A33635 или #A33. Превью сохранено.'
                    : `Введи число от ${range.min} до ${range.max}, шаг ${range.step}. Превью сохранено.`;
            control.error.hidden = false;
            return;
        }
        control.input.removeAttribute('aria-invalid');
        control.error.hidden = true;
        state[parameter.id] = value;
        state.overrides = state.overrides.filter((id) => id !== parameter.id);
        if (parameter.type !== 'font' || value !== 'original') state.overrides.push(parameter.id);
        if (parameter.type === 'font') constrainWeights();
        render(input);
    });
    panel.addEventListener('compositionend', (event) => {
        if (event.target.matches('[data-parameter]'))
            event.target.dispatchEvent(new Event('input', { bubbles: true }));
    });
    panel.addEventListener('focusout', (event) => {
        const input = event.target.closest('[data-parameter]');
        if (!input || input.hasAttribute('data-auxiliary')) return;
        const parameter = PARAMETERS.find((item) => item.id === input.dataset.parameter);
        if (
            parameter.type === 'number' &&
            input.value.trim() &&
            Number.isFinite(Number(input.value))
        ) {
            const range = weightRange(parameter, state);
            const value = Math.max(range.min, Math.min(range.max, Number(input.value)));
            state[parameter.id] = Number(
                (range.min + Math.round((value - range.min) / range.step) * range.step).toFixed(6),
            );
            render();
        } else syncControls();
    });
    panel.addEventListener('click', (event) => {
        const reset = event.target.closest('[data-customizer-section-reset]');
        if (!reset) return;
        for (const parameter of PARAMETERS.filter(
            (item) => item.section === reset.dataset.customizerSectionReset,
        ))
            state[parameter.id] = defaults[parameter.id];
        state.overrides = state.overrides.filter(
            (id) =>
                PARAMETERS.find((item) => item.id === id).section !==
                reset.dataset.customizerSectionReset,
        );
        render();
        say('Раздел сброшен. Остальные настройки сохранены.');
    });
    panel.querySelector('[data-customizer-reset]').addEventListener('click', () => {
        state = { ...defaults, overrides: [] };
        exportBox.hidden = true;
        render();
        if (storageAvailable) say('Все настройки сброшены. Исходный дизайн восстановлен.');
    });
    preset.addEventListener('change', () => {
        if (!Object.hasOwn(PRESETS, preset.value)) return;
        state = {
            ...defaults,
            ...PRESETS[preset.value],
            overrides: Object.keys(PRESETS[preset.value]),
        };
        constrainWeights();
        render();
    });
    panel.querySelector('[data-customizer-copy]').addEventListener('click', async () => {
        const css = exportField.value;
        try {
            if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
            await navigator.clipboard.writeText(css);
            say('CSS скопирован. Добавь его в конец стилей проекта.');
        } catch {
            exportBox.hidden = false;
            exportField.focus();
            exportField.select();
            say('Скопируй выделенный CSS вручную: Ctrl+C или меню устройства.');
        }
    });
    // Re-evaluate actual rendered contrast after hover transitions and tab changes.
    landing.addEventListener('transitionend', () => {
        if (!panel.hidden) updateContrast(contrast, landing);
    });
    landing.addEventListener('click', () => {
        if (!panel.hidden) requestAnimationFrame(() => updateContrast(contrast, landing));
    });
}
