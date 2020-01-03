# vscode-(s)quirrel




## References

### Language and syntax highlighting

- [Squirrel language reference](http://squirrel-lang.org/squirreldoc/reference/language.html)
- [Electric Imp Squirrel programming guide](https://developer.electricimp.com/squirrel/squirrelcrib)
- [Gaijin's Quirrel language reference](http://quirrel.io/doc/reference/diff_from_original.html)
- [VSCode highlight guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide)
- [Sublime Text syntax definitions](https://sublime-text-unofficial-documentation.readthedocs.io/en/latest/reference/syntaxdefs.html)
- [Oniguruma regexp syntax](https://macromates.com/manual/en/regular_expressions)
- [TextMate language grammar](https://macromates.com/manual/en/language_grammars)
- [Standard scope naming](https://www.sublimetext.com/docs/3/scope_naming.html)

### Repositories

- [Quirrel language](https://github.com/GaijinEntertainment/quirrel)
- [Syntax highlighting, some snippets for squirrel](https://github.com/robmerrell/squirrel-tmbundle)
- [Top VSCode squirrel extension](https://github.com/monkeygroover/vscode-squirrel-lang)
- [Microsoft JS highlighting rules](https://github.com/microsoft/vscode/blob/master/extensions/javascript/syntaxes/JavaScript.tmLanguage.json)
- [Beautifier for javascript](https://github.com/beautify-web/js-beautify/)
- [Slightly better but buggy syntax highlighting](https://bitbucket.org/marcinbar91/vscode-squirrel.git/src)


## Roadmap

[x] Basic squirrel syntax highlighting
[ ] Capture inner blocks of interpolated strings
    ($"{_block_}")
[ ] Highlight all function identifiers, including function arguments, array values and table fields definitions
    (._func_(), function _func_(), _func_ = function()|@(), (_func_()), \[_func_()\], { _func_ = function()|@() })
[ ] Ctrl+click on file path to open
[ ] Autocompletion for project files path while typing
[ ] Set of common key-value pairs for table fields autocompletion (key = val1|val2 ...)
[ ] Highlighting of JSDOC tags in documentation comment blocks /** */
[ ] Traversing blocks, tables, strings interpolation, function arguments etc
[ ] Definitions for common global classes, functions and constants
[ ] Static syntax analyzer
[ ] Autoidentation
[ ] Local and cross module go to declaration
