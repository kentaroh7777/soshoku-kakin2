{
    "presets": ["next/babel"],
    "plugins": [
      [
        "babel-plugin-styled-components",
        {
          "displayName": true,
          "fileName": false
        },
        "styled-components",
        { "ssr": true }
      ]
    ]
}