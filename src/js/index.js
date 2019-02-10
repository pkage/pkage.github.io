$('#scm-trigger').click(() => {
	$('#3d').html('<iframe src="/3d/ocean/ocean.html"></iframe>')
	wd.stop_simulation().then(() => {
		window.trigger3DScene()
		$('#scm-trigger').fadeOut()
	})
})
