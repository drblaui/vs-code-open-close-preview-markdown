import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let markdownPreviewCommand = "markdown.showPreviewToSide";
	let currPreview: string;
	let alreadyOpened = false;

	function previewMarkdown() {
		let editor = vscode.window.activeTextEditor;

		if(alreadyOpened && editor && currPreview === editor.document.fileName && editor.document.languageId === "markdown") {
			return;
		}

		if(editor && currPreview !== editor.document.fileName && editor.document.languageId === "markdown") {
			currPreview = editor.document.fileName;
		}


		if(editor) {
			let document = editor.document;

			if(document && document.languageId === "markdown") {
				openMarkdownPreview();
				alreadyOpened = true;
				currPreview = document.fileName;
			}
		}
	}

	function openMarkdownPreview() {
		vscode.commands.executeCommand(markdownPreviewCommand)
		.then(() => {}, (e) => vscode.window.showErrorMessage(e))
		.then(() => { vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");});
	}

	if(vscode.window.activeTextEditor) {
		previewMarkdown();
	}

	vscode.window.onDidChangeActiveTextEditor(() => {
		previewMarkdown();
	});
	

	vscode.workspace.onDidOpenTextDocument((doc) => {
		if(doc && doc.languageId === "markdown") {
			openMarkdownPreview();
			currPreview = doc.fileName;
		}
	});

	vscode.workspace.onDidCloseTextDocument((doc) => {
		if(doc.languageId === "markdown" && currPreview === doc.fileName) {
			alreadyOpened = false;
			vscode.commands.executeCommand("workbench.action.closeEditorsInOtherGroups");
		}
	});
}

export function deactivate() {}
