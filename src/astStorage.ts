import * as vs from 'vscode';
import { exec } from 'child_process';

enum AstNodeType {
  PNT_UNKNOWN = "unknown-op",
  PNT_NULL = "null",
  PNT_INTEGER = "int-number",
  PNT_BOOL = "boolean",
  PNT_FLOAT = "float-number",
  PNT_STRING = "string-literal",
  PNT_IDENTIFIER = "identifier",
  PNT_VAR_PARAMS = "var-params",
  PNT_KEY_VALUE = "key-value",
  PNT_MAKE_KEY = "make-key",
  PNT_LIST_OF_KEYS_ARRAY = "list-of-keys-array",
  PNT_LIST_OF_KEYS_TABLE = "list-of-keys-table",
  PNT_READER_MACRO = "reader-macro",
  PNT_UNARY_PRE_OP = "unary-pre-op",
  PNT_UNARY_POST_OP = "unary-post-op",
  PNT_BINARY_OP = "binary-op",
  PNT_TERNARY_OP = "ternary-op",
  PNT_EXPRESSION_PAREN = "expression-paren",
  PNT_ROOT = "root",
  PNT_THIS = "this",
  PNT_BASE = "base",
  PNT_ACCESS_MEMBER = "access-member",
  PNT_ACCESS_MEMBER_IF_NOT_NULL = "access-member-if-not-null",
  PNT_FUNCTION_CALL = "function-call",
  PNT_FUNCTION_CALL_IF_NOT_NULL = "function-call-if-not-null",
  PNT_ARRAY_CREATION = "array-creation",
  PNT_TABLE_CREATION = "table-creation",
  PNT_CONST_DECLARATION = "const-declaration",
  PNT_GLOBAL_CONST_DECLARATION = "global-const-declaration",
  PNT_LOCAL_VAR_DECLARATION = "local-var-declaration",
  PNT_VAR_DECLARATOR = "var-declarator",
  PNT_INEXPR_VAR_DECLARATOR = "inexpr-var-declarator",
  PNT_EMPTY_STATEMENT = "empty-statement",
  PNT_STATEMENT_LIST = "statement-list",
  PNT_IF_ELSE = "if-else",
  PNT_WHILE_LOOP = "while-loop",
  PNT_DO_WHILE_LOOP = "do-while-loop",
  PNT_FOR_LOOP = "for-loop",
  PNT_FOR_EACH_LOOP = "for-each-loop",
  PNT_LOCAL_FUNCTION = "local-function",
  PNT_FUNCTION = "function",
  PNT_LAMBDA = "lambda",
  PNT_FUNCTION_PARAMETERS_LIST = "function-parameters-list",
  PNT_FUNCTION_PARAMETER = "function-parameter",
  PNT_RETURN = "return",
  PNT_YIELD = "yield",
  PNT_BREAK = "break",
  PNT_CONTINUE = "continue",
  PNT_THROW = "throw",
  PNT_TRY_CATCH = "try-catch",
  PNT_SWITCH_STATEMENT = "switch-statement",
  PNT_SWITCH_CASE = "switch-case",
  PNT_CLASS = "class",
  PNT_LOCAL_CLASS = "local-class",
  PNT_ATTRIBUTES_LIST = "attributes-list",
  PNT_ATTRIBUTE = "attribute",
  PNT_CLASS_METHOD = "class-method",
  PNT_CLASS_CONSTRUCTOR = "class-constructor",
  PNT_ACCESS_CONSTRUCTOR = "access-constructor",
  PNT_CLASS_MEMBER = "class-member",
  PNT_STATIC_CLASS_MEMBER = "static-class-member",
  PNT_ENUM = "enum",
  PNT_GLOBAL_ENUM = "global-enum",
  PNT_ENUM_MEMBER = "enum-member",
  PNT_DOCSTRING = "docstring",
}

enum AstTokenType {
  TK_EMPTY = "TK_EMPTY",
  TK_EOF = "TK_EOF",
  TK_IDENTIFIER = "TK_IDENTIFIER",
  TK_STRING_LITERAL = "TK_STRING_LITERAL",
  TK_INTEGER = "TK_INTEGER",
  TK_FLOAT = "TK_FLOAT",
  TK_ASSIGN = "TK_ASSIGN",
  TK_INEXPR_ASSIGNMENT = "TK_INEXPR_ASSIGNMENT",
  TK_COMMA = "TK_COMMA",
  TK_DOT = "TK_DOT",
  TK_PLUS = "TK_PLUS",
  TK_MINUS = "TK_MINUS",
  TK_MUL = "TK_MUL",
  TK_DIV = "TK_DIV",
  TK_NOT = "TK_NOT",
  TK_INV = "TK_INV",
  TK_BITXOR = "TK_BITXOR",
  TK_BITOR = "TK_BITOR",
  TK_BITAND = "TK_BITAND",
  TK_AT = "TK_AT",
  TK_DOUBLE_COLON = "TK_DOUBLE_COLON",
  TK_PLUSPLUS = "TK_PLUSPLUS",
  TK_MINUSMINUS = "TK_MINUSMINUS",
  TK_LBRACE = "TK_LBRACE",
  TK_RBRACE = "TK_RBRACE",
  TK_LSQUARE = "TK_LSQUARE",
  TK_RSQUARE = "TK_RSQUARE",
  TK_LPAREN = "TK_LPAREN",
  TK_RPAREN = "TK_RPAREN",
  TK_LS = "TK_LS",
  TK_GT = "TK_GT",
  TK_EQ = "TK_EQ",
  TK_NE = "TK_NE",
  TK_LE = "TK_LE",
  TK_GE = "TK_GE",
  TK_AND = "TK_AND",
  TK_OR = "TK_OR",
  TK_NEWSLOT = "TK_NEWSLOT",
  TK_MODULO = "TK_MODULO",
  TK_PLUSEQ = "TK_PLUSEQ",
  TK_MINUSEQ = "TK_MINUSEQ",
  TK_MULEQ = "TK_MULEQ",
  TK_DIVEQ = "TK_DIVEQ",
  TK_MODEQ = "TK_MODEQ",
  TK_SHIFTL = "TK_SHIFTL",
  TK_SHIFTR = "TK_SHIFTR",
  TK_USHIFTR = "TK_USHIFTR",
  TK_3WAYSCMP = "TK_3WAYSCMP",
  TK_VARPARAMS = "TK_VARPARAMS",
  TK_QMARK = "TK_QMARK",
  TK_COLON = "TK_COLON",
  TK_SEMICOLON = "TK_SEMICOLON",
  TK_NULLCOALESCE = "TK_NULLCOALESCE",
  TK_NULLGETSTR = "TK_NULLGETSTR",
  TK_NULLGETOBJ = "TK_NULLGETOBJ",
  TK_NULLCALL = "TK_NULLCALL",
  TK_NULL = "TK_NULL",
  TK_TRUE = "TK_TRUE",
  TK_FALSE = "TK_FALSE",
  TK_BASE = "TK_BASE",
  TK_DELETE = "TK_DELETE",
  TK_SWITCH = "TK_SWITCH",
  TK_IF = "TK_IF",
  TK_ELSE = "TK_ELSE",
  TK_FOR = "TK_FOR",
  TK_FOREACH = "TK_FOREACH",
  TK_WHILE = "TK_WHILE",
  TK_DO = "TK_DO",
  TK_BREAK = "TK_BREAK",
  TK_IN = "TK_IN",
  TK_LOCAL = "TK_LOCAL",
  TK_CLONE = "TK_CLONE",
  TK_FUNCTION = "TK_FUNCTION",
  TK_RETURN = "TK_RETURN",
  TK_TYPEOF = "TK_TYPEOF",
  TK_CONTINUE = "TK_CONTINUE",
  TK_YIELD = "TK_YIELD",
  TK_TRY = "TK_TRY",
  TK_CATCH = "TK_CATCH",
  TK_THROW = "TK_THROW",
  TK_RESUME = "TK_RESUME",
  TK_CASE = "TK_CASE",
  TK_DEFAULT = "TK_DEFAULT",
  TK_THIS = "TK_THIS",
  TK_CLASS = "TK_CLASS",
  TK_EXTENDS = "TK_EXTENDS",
  TK_CONSTRUCTOR = "TK_CONSTRUCTOR",
  TK_INSTANCEOF = "TK_INSTANCEOF",
  TK_LINE = "TK___LINE__",
  TK_FILE = "TK___FILE__",
  TK_STATIC = "TK_STATIC",
  TK_ENUM = "TK_ENUM",
  TK_CONST = "TK_CONST",
  TK_RAWCALL = "TK_RAWCALL",
  TK_DOCSTRING = "TK_DOCSTRING",
  TK_GLOBAL = "TK_GLOBAL",
  TK_READER_MACRO = "TK_READER_MACRO",
  TK_NOTTXT = "TK_NOTTXT",
  TK_NOTIN = "TK_NOTIN",
}

type AstNode = {
  nt: AstNodeType,
  tt: AstTokenType,
  val: string,
  line: number,
  col: number,
  children?: AstNode[],
  parent?: AstNode,
}

type AstResult = {
  root: AstNode,
  nav?: { [line: number]: { [col: number]: AstNode } }
}

type Ast = AstResult | null

const versionControl: { [key: string]: number; } = {};
const astCache: { [key: string]: AstResult; } = {};

export default async function requestAst(document: vs.TextDocument) {
  if (document.languageId !== 'squirrel')
    return undefined;

  return new Promise<Ast>((resolve) => {
    const srcPath = document.uri.fsPath;
    const version = document.version;
    const cached = astCache[srcPath];
    if (versionControl[srcPath] === version && cached) {
      resolve(cached);
      return;
    }
    versionControl[srcPath] = version;

    const config = vs.workspace.getConfiguration('squirrel.syntaxChecker');
    let fileName: string = config.get('fileName') || '';
    fileName = process.env[fileName] || fileName;
    let options: string = config.get('optionsBuildTree') || '';
    options = options.replace(/\$\{source\}/gi, srcPath);

    exec(`${fileName} ${options}`, (error, stdout, stderr) => {
      if (error || stderr) {
        resolve(null);
        return;
      }

      const ast: AstResult = JSON.parse(stdout);
      ast.nav = {};
      const nodeList: AstNode[] = [ast.root];
      while (nodeList.length) {
        const node = nodeList.pop();
        if (!node)
          continue;

        // add navigation map
        const line = --node.line;
        const col = --node.col;
        const lineIndex = ast.nav[line] ?? {};
        ast.nav[line] = lineIndex;
        lineIndex[col] = node;

        // add upward linkage
        const children = node?.children || [];
        children.forEach((child) => child ? child.parent = node : null);
        nodeList.push(...children);
      }

      astCache[srcPath] = ast;
      resolve(ast);
    });
  });
}