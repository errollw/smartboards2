// make the paper scope global, by injecting it into window:
paper.install(window);

function save(){
	console.log(project.exportJSON({asString:true}));
}