function showDiv(content) {
	let i, tabcontent;

	tabcontent = document.getElementsByClassName('tabcontent');
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = 'none';
	}
	document.getElementById(content).style.display = 'block';
	document.getElementById('searchContainer').style.display = 'flex';
}

showDiv('home');