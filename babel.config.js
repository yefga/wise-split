module.exports = {
    plugins: [
        [
            "module-resolver",
            {
                root: ["./src"],
                alias: {
                    "@components": "./src/components",
                    "@store": "./src/store",
                    "@app-types": "./src/types",
                    "@constants": "./src/constants"
                }
            }
        ]
    ]
};
