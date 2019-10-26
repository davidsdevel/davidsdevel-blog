function initQuill() {
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],
		['blockquote', 'code-block'],
		[{ 'header': 3 }, { 'header': 4 }],
		[{ 'list': 'ordered'}, { 'list': 'bullet' }],
		[{ 'script': 'sub'}, { 'script': 'super' }],
		[{ 'indent': '-1'}, { 'indent': '+1' }],
		[{ 'direction': 'rtl' }],
		[{ 'size': ['small', false, 'large', 'huge'] }],
		[{ 'header': [3, 4, 5, 6, false] }],
		[ 'link', 'image', 'video', 'formula' ],
		[{ 'color': [] }, { 'background': [] }],
		[{ 'font': [] }],
		[{ 'align': [] }],
		['clean']
	];


	const codeBlock = Quill.import('formats/code-block');
	const AlignStyle = Quill.import('attributors/style/align');
	const BackgroundStyle = Quill.import('attributors/style/background');
	const ColorStyle = Quill.import('attributors/style/color');
	const DirectionStyle = Quill.import('attributors/style/direction');
	const FontStyle = Quill.import('attributors/style/font');
	const SizeStyle = Quill.import('attributors/style/size');
	const InlineBlot = Quill.import('blots/block');

	codeBlock.className = "prettyprint";

	class ImageBlot extends InlineBlot {
		static create(data) {
			const node = super.create(data);
			node.setAttribute('data-src', data.dataSrc);
			node.setAttribute('src', data.src);
			node.setAttribute('alt', window.react.state.title + " - David's Devel");
			node.setAttribute('title', window.react.state.title + " - David's Devel");
			node.setAttribute('style', `width: ${data.width}px;`);
			return node;
		}
		static value(domNode) {
			const { src, custom } = domNode.dataset;
			return { src, custom };
		}
	}
	ImageBlot.blotName = 'imageBlot';
	ImageBlot.className = 'lazy';
	ImageBlot.tagName = 'img';

	Quill.register({ 'formats/imageBlot': ImageBlot });
	Quill.register(AlignStyle, true);
	Quill.register(BackgroundStyle, true);
	Quill.register(ColorStyle, true);
	Quill.register(DirectionStyle, true);
	Quill.register(FontStyle, true);
	Quill.register(SizeStyle, true);
	Quill.register(codeBlock, true);

	return new Quill('#editor', {
		modules: {
			toolbar: toolbarOptions
		},
		theme: 'snow'
	});
}
function imgHandler() {

	const container = this.container;
	let fileInput = container.querySelector('input.ql-image[type=file]');
		
	if (fileInput == null) {		
		fileInput = document.createElement('input');		
		fileInput.setAttribute('type', 'file');
		fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
		fileInput.classList.add('ql-image');
		fileInput.onchange = () => {
			var width;

			const files = fileInput.files;
			const range = this.quill.getSelection(true);
		
			const reader = new FileReader();
			reader.readAsDataURL(files[0]);
			reader.onloadend = ({target}) => {
				let image = new Image();
				image.src = target.result;
				setTimeout(() => (width = image.naturalWidth), 100);
			}

			if (!files || !files.length) {
				console.log('No files selected');
				return;
			}
		
			const formData = new FormData();
			formData.append('file', files[0]);
			formData.append("name", files[0].name);
			formData.append("mime", files[0].type);

			var q = this.quill;
			q.enable(false);
		
			fetch("/upload/image", {
				method: "POST",
				body: formData
			})
			.then(function(req) {return req.json()})
			.then(function(data) {
				q.enable(true);
				q.editor.insertEmbed(range.index, 'imageBlot', {
					dataSrc: data.src,
					src: data.thumb,
					width
				});
				q.setSelection(range.index + 1, Quill.sources.SILENT);
				fileInput.value = '';

				setTimeout(() => {
					const lazy = document.querySelectorAll('.lazy');
					lazy.forEach(e => {
						e.oncontextmenu = ev => ev.preventDefault();
						e.onauxclick = ev => {
							ev.preventDefault();
							console.log("Data")
						}
						console.log(e)
					})
				}, 100);

				if (!window.react.state.image) {
					window.react.setState({
						image: data.src
					});
				}
			})
			.catch(error => {
				console.error('quill image upload failed');
				console.error(error);
				q.enable(true);
			});
		};
		this.container.appendChild(fileInput);
	}
	fileInput.click();
}
