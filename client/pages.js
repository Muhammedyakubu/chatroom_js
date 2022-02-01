const pages = {
	login: `
	<h1 class="header">Welcome to Chat<span>Room!</span></h1>
	<div id="flash-box"></div>
	<form id="login" class="container center-modal">
		<label for="name-input">Name</label><br>
		<input type="text" id="name-input" placeholder="your name here..."><br>
		<button id="login-button">Login</button><br/>
		<a href="#" onclick="loadPage('register')">Don't have an account?</a>
	</form>
	`,
	register: `
	<h1 class="header">Welcome to Chat<span>Room!</span></h1>
	<div id="flash-box"></div>
	<form id="register" class="container center-modal">
		<label for="name-input">Name</label><br>
		<input type="text" id="name-input" placeholder="your name here..."><br>
		<button id="register-button">Register</button><br/>
        <a href="#" onclick="loadPage('login')">Already have an account?</a>
	</form>
	`,
	home: `
	<h1 class="header">Welcome to Chat<span>Room!</span></h1>
	<div id="flash-box"></div>
	<form id="home" class="container center-modal">
		<button onclick="loadPage('login')">Login</button>
		<button onclick="loadPage('register')">Register</button>
	</form>	
	`,
	chat: `
	<div class="content">
		<nav>
			<h1 class="header">Chat<span>Room</span></h1>
			<button id="sign-out">Sign Out</button>
		</nav>
		<div id="flash-box"></div>
		<div class="messages-container">
			
		</div>

		<form id="send-container">
			<input type="text" id="message-input" placeholder="new message...">
			<button id="send-button">send</button>
		</form>
	</div>`,
	err503: `
  <p class="error">I'm sorry, something went wrong :( </p><br/>
  <button onclick="loadPage('login')">Login</button>`,
};
