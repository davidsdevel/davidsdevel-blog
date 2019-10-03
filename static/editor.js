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

	const AlignStyle = Quill.import('attributors/style/align');
	const BackgroundStyle = Quill.import('attributors/style/background');
	const ColorStyle = Quill.import('attributors/style/color');
	const DirectionStyle = Quill.import('attributors/style/direction');
	const FontStyle = Quill.import('attributors/style/font');
	const SizeStyle = Quill.import('attributors/style/size');

	Quill.register(AlignStyle, true);
	Quill.register(BackgroundStyle, true);
	Quill.register(ColorStyle, true);
	Quill.register(DirectionStyle, true);
	Quill.register(FontStyle, true);
	Quill.register(SizeStyle, true);

	return new Quill('#editor', {
		modules: {
			toolbar: toolbarOptions
		},
		theme: 'snow',
		debug:"info"
	});
}

function imgHandler(react) {
    let fileInput = this.container.querySelector('input.ql-image[type=file]');

    if (fileInput == null) {
        fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
        fileInput.classList.add('ql-image');
        fileInput.onchange = () => {
            const files = fileInput.files;
            const range = this.quill.getSelection(true);

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
            .then(function(req) {return req.text()})
            .then(function(data) {
                q.enable(true);
                q.editor.insertEmbed(range.index, 'image', data);
                q.setSelection(range.index + 1, Quill.sources.SILENT);
                fileInput.value = '';
                console.log(!$r.state.image);
                if (!$r.state.image) {
                    $r.setState({
                        image: data
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

