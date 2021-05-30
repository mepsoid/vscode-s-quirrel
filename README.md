# vscode-(s)quirrel

## Setup

* Run VS Code;
* Open extension marketplace panel, find and install `(S)quirrel` language support extension;
* Open settings window (Ctrl+<,>) and find Extensions/(S)quirrel section;
* Setup path to static code analyzer `Squirrel/Syntax Checker/File Name` executable, which default value is `sq3_static_analyzer-dev`. Note: you can setup name of environment variable that contains pat, either full path to file or short file name that should be discoverable by system `PATH` environment variable;
* Setup path to the squirrel code runner `Squirrel/Code Runner/File Name` executable, with default value `csq-dev`. Note: you can also use name of the environmental variable, full path or short file name;
* You are ready to go;

## Some hints on usage

* Start typing identifier name finishing with `=` symbol. If this key is known tou will get list of appropriate substitution values;
* Set cursor to `require()` method argument with module path and press `F12`. If module found it will be opened in new tab;
* Type `require("` with some known characters of module file name and press Ctrl+<Space> to get list of paths to suitable files from workspace;
* Save document to run code checker. All found code errors will be displayed at common Problems panel;
* Create or open document from disk and press Ctrl+<F5> to run it. Found compile time or run time errors will be displayed at Problems pabel. All output will be displayed and highlighted at Output panel;

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

- [x] Basic squirrel syntax highlighting
- [x] Editor key binding to open selected module file path in new tab
- [x] Capture inner blocks of interpolated strings
      ($"{_block_}")
- [x] External syntax static analyzer
- [x] Whiteboard for code quick check
- [x] Set of common key-value pairs for table fields autocompletion (key = val1|val2 ...)
- [ ] Definitions for common global classes, functions and constants
- [ ] Local and cross module go to declaration
- [ ] Autocompletion for workspace files path while typing
- [ ] Tooltips over code tokens
- [ ] Remove trailing spaces on document save
- [ ] Color variance for identifiers based on their's name
- [ ] Highlighting of JSDOC tags in documentation comment blocks /** */
- [ ] Traversing blocks, tables, strings interpolation, function arguments etc
- [ ] Autoidentation
