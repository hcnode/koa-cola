module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "plugins": [
        "react"
    ],
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "no-console": ["error", { allow: ["log", "warn", "error"] }],
        // "linebreak-style": [
        //     "error",
        //     "unix"
        // ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};