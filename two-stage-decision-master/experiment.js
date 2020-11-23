/* ************************************ */
/* Define helper functions */
/* ************************************ */


var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

function assessPerformance() {
	/* Function to calculate the "credit_var", which is a boolean used to
	credit individual experiments in expfactory. */
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < choices.length; k++) {
		choice_counts[choices[k]] = 0
	}
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].possible_responses != 'none') {
			trial_count += 1
			rt = experiment_data[i].rt
			key = experiment_data[i].key_press
			choice_counts[key] += 1
			if (rt == -1) {
				missed_count += 1
			} else {
				rt_array.push(rt)
			}
		}
	}
	//calculate average rt
	var avg_rt = -1
	if (rt_array.length !== 0) {
		avg_rt = math.median(rt_array)
	}
		//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.85) {
			responses_ok = false
		}
	})
	var missed_percent = missed_count/trial_count
	credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok)
	if (credit_var === true) {
	  performance_var = total_score
	} else {
	  performance_var = 0
	}
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var, "performance_var": performance_var})
}

function evalAttentionChecks() {
	var check_percent = 1
	if (run_attention_checks) {
		var attention_check_trials = jsPsych.data.getTrialsOfType('attention-check')
		var checks_passed = 0
		for (var i = 0; i < attention_check_trials.length; i++) {
			if (attention_check_trials[i].correct === true) {
				checks_passed += 1
			}
		}
		check_percent = checks_passed / attention_check_trials.length
	}
	return check_percent
}

//Polar method for generating random samples from a norma distribution.
//Source: http://blog.yjl.im/2010/09/simulating-normal-random-variable-using.html
function normal_random(mean, variance) {
	if (mean === undefined)
		mean = 0.0;
	if (variance === undefined)
		variance = 1.0;
	var V1, V2, S;
	do {
		var U1 = Math.random();
		var U2 = Math.random();
		V1 = 2 * U1 - 1;
		V2 = 2 * U2 - 1;
		S = V1 * V1 + V2 * V2;
	} while (S > 1);

	X = Math.sqrt(-2 * Math.log(S) / S) * V1;
	//Y = Math.sqrt(-2 * Math.log(S) / S) * V2;
	X = mean + Math.sqrt(variance) * X;
	//Y = mean + Math.sqrt(variance) * Y ;
	return X;
}

var get_condition = function() {
	return condition
}

var get_current_trial = function() {
	return current_trial
}

var initialize_FB_matrix = function() {
	return [Math.random() * 0.5 + 0.25, Math.random() * 0.5 + 0.25, Math.random() * 0.5 + 0.25, Math.random() * 0.5 + 0.25]
}

//Change phase from practice to test
var change_phase = function() {
	if (curr_images == practice_images) {
		curr_images = test_images
		curr_colors = test_colors
		curr_fs_stims = test_fs_stims
		curr_ss_stims = test_ss_stim
		exp_stage = 'test'
	} else {
		curr_images = practice_images
		curr_colors = practice_colors
		curr_fs_stims = practice_fs_stims
		curr_ss_stim = practice_ss_stim
		exp_stage = 'practice'
	}
	total_score = 0
	current_trial = -1 //reset count
}


/*
Generate first stage stims. Takes in an array of images and colors (which change between practice anad test)
*/
var get_fs_stim = function(images, colors) {
	var fs_stim = [{
		stimulus: "<img class = 'background_images' src= '" + background_Image_stage_1 +"'> </img></div>"+
			"<div class = decision-left style='background:" + colors[0] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[0] + "'></img>" +
			"<img class = 'strategy_stim' src= '" + strategy_stim[2] +"'> </img></div>" +
			"<div class = decision-right style='background:" + colors[0] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[1] + "'></img>" +
			"<img class = 'strategy_stim' src= '" + strategy_stim[0] +"'> </img></div>",
		stim_order: [0, 1]
	}, {
		stimulus: "<img class = 'background_images' src= '" + background_Image_stage_1 +"'> </img></div>"+
		"<div class = decision-left style='background:" + colors[0] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[1] + "'></img>" +
			"<img class = 'strategy_stim' src= '" + strategy_stim[1] +"'> </img></div>" +
			"<div class = decision-right style='background:" + colors[0] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[0] + "'></img>" +
			"<img class = 'strategy_stim' src= '" + strategy_stim[2] +"'> </img></div>",
		stim_order: [1, 0]
	}]
	return fs_stim
}

/*
Generate second stage stims. Takes in an array of images and colors (which change between practice and test)
*/
var get_ss_stim = function(images, colors) {
	var ss_stim_array = [
		["<img class = 'background_images' src= '" + background_Image_stage_2_green +"'> </img></div>"+
			"<div class = decision-left style='background:" + colors[1] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[2] + "'></img></div>" +
			"<div class = decision-right style='background:" + colors[1] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[3] + "'></img></div>",
			"<img class = 'background_images' src= '" + background_Image_stage_2_green +"'> </img></div>"+
			"<div class = decision-left style='background:" + colors[1] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[3] + "'></img></div>" +
			"<div class = decision-right style='background:" + colors[1] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[2] + "'></img></div>"
		],
		["<img class = 'background_images' src= '" + background_Image_stage_2_purpel +"'> </img></div>"+
			"<div class = decision-left style='background:" + colors[2] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[4] + "'></img></div>" +
			"<div class = decision-right style='background:" + colors[2] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[5] + "'></img></div>",
			"<img class = 'background_images' src= '" + background_Image_stage_2_purpel +"'> </img></div>"+
			"<div class = decision-left style='background:" + colors[2] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[5] + "'></img></div>" +
			"<div class = decision-right style='background:" + colors[2] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[4] + "'></img></div>"
		]
	]

	var ss_stim = {
		stimulus: [ss_stim_array[0][0], ss_stim_array[0][1], ss_stim_array[1][0], ss_stim_array[1][1]],
		stim_order: [[2, 3], [3, 2], [4, 5], [5, 4]]
	}
	return ss_stim
}


/*
The following methods all support the user-dependent presentation of stimulus including animations, multiple stages
and FB. The "get_selected" functions also append data to the preceeding trials
*/

/* Selects the next first stage from a predefined, randomized list of first stages and increases the trial count*/
var choose_first_stage = function() {
	current_trial = current_trial + 1
	stim_ids = curr_fs_stims.stim_order[current_trial]
	return [curr_fs_stims.stimulus[current_trial],stim_ids]
}

/*
After a stimulus is selected, an animation proceeds whereby the selected stimulus moves to the top of the screen while
the other stimulus fades. This function accomplishes this by creating a new html object to display composed of the old stim
with appropriate handles to start the relevant animations.

Also updates the global variables choice, first_selected and first_notselected, which are used in the next function
*/
var get_first_selected = function() {
	var first_stage_trial = jsPsych.data.getLastTrialData()
	var i = first_stage_trial.key_press;
	// console.log(" i = "+i);
	// console.log("  = "+i);
	var choice = choices.indexOf(first_stage_trial.key_press)
	if (i == 37 && stim_ids[0] == 1 || i == 39 && stim_ids[0] == 0) {
		first_selected = stim_ids[choice]
		var first_notselected = stim_ids[1 - choice]
		jsPsych.data.addDataToLastTrial({
			stim_selected: first_selected
		})
		return "<img class = 'background_images' src= '" + background_Image_stage_1 +"'> </img></div>"+
		"<div class = 'selected " + stim_side[choice] + "' style='background:" + curr_colors[0] +
			"; '>" +
			"<img class = 'decision-stim' src= '" + curr_images[first_selected] + "'></div>" +
			"<div class = '" + stim_side[1 - choice] + " fade' style='background:" + curr_colors[0] +
			"; '>" +
			"<img class = 'decision-stim  *2fade' src= '" + curr_images[first_notselected] + "'></div>"


		} else if(i == -1){
					if(stim_ids[0] == 0){
						first_selected = stim_ids[0]
						var first_notselected = stim_ids[1 - 0]
						return "<img class = 'background_images' src= '" + background_Image_stage_1 +"'> </img></div>"+
						"<div class = 'selected " + stim_side[0] + "' style='background:" + curr_colors[0] +
							"; '>" +
							"<img class = 'decision-stim' src= '" + curr_images[first_selected] + "'></div>" +
							"<div class = '" + stim_side[1] + " fade' style='background:" + curr_colors[0] +
							"; '>" +
							"<img class = 'decision-stim  fade' src= '" + curr_images[first_notselected] + "'></div>"
					}else{
						first_selected = stim_ids[1]
						var first_notselected = stim_ids[0]
						return "<img class = 'background_images' src= '" + background_Image_stage_1 +"'> </img></div>"+
						 "<div class = 'selected " + stim_side[1] + "' style='background:" + curr_colors[0] +
							"; '>" +
							"<img class = 'decision-stim' src= '" + curr_images[first_selected] + "'></div>" +
							"<div class = '" + stim_side[0] + " fade' style='background:" + curr_colors[0] +
							"; '>" +
							"<img class = 'decision-stim  fade' src= '" + curr_images[first_notselected] + "'></div>"
					}
	}else {
		first_selected = -1
		jsPsych.data.addDataToLastTrial({
			stim_selected: first_selected
		})
	}
}

/*
The second stage is probabilistically chosen based on the first stage choice. Each of the first stage stimulus is primarily associated
with one of two second stages, but the transition is ultimately probabilistic.

This function checks to see if there was any first stage response. If not, set the global variable FB_on to off and display a reminder
If an choice was taken, display the chosen stimulus at the top of the screen and select a second stage (choosing the one associated with the
choice 70% of the time). Randomly select a presentation order for the two stimulus associated with the second stage
*/
var choose_second_stage = function() {
	if (first_selected == -1) {
		FB_on = 0;
		return "<div class = centerbox><div class = center-text>" +
			"Wrong key</div></div>"
	} else {
		FB_on = 1;
		stage = first_selected
		transition = 'frequent'
		if (Math.random() < 0.3) {
			stage = 1 - stage
			transition = 'infrequent'
		}

		var stage_index = stage * 2
		var stim_index = stage_index + Math.round(Math.random())
		stim_ids = curr_ss_stims.stim_order[stim_index]
		return "<div class = 'decision-top faded' style='background:" + curr_colors[0] + "; '>" +
		//*S**Y*	"<img class = 'decision-stim' src= '" + curr_images[first_selected] + "'></div>" +
			curr_ss_stims.stimulus[stim_index]
		 //*S* "<div class = 'decision-top faded' style='background:" + curr_colors[0] + "; '>" +
			//*S*	"<img class = 'decision-stim' src= '" + curr_images[first_selected] + "'></div>" +
			// curr_ss_stims.stimulus[stim_index]
	}
}

/*
Animates second stage choice, similarly to get_first_selected
*/
var get_second_selected = function() {
	var second_stage_trial = jsPsych.data.getLastTrialData()
	var choice = choices.indexOf(second_stage_trial.key_press)
	// console.log("stim_ids- "+ stim_ids);
	if (stim_ids[0] == 2 || stim_ids[0] == 3 ){
		var background = background_Image_stage_2_green
	}else {
		var background = background_Image_stage_2_purpel
	}
	if (choice != -1) {
		second_selected = stim_ids[choice]
		var second_notselected = stim_ids[1 - choice]
		jsPsych.data.addDataToLastTrial({
			stim_selected: second_selected
		})
		return "<div class = '" + stim_side[choice] + " selected' style='background:" + curr_colors[
				stage + 1] + "; '>" +
			"<img class = 'decision-stim' src= '" + curr_images[second_selected] + "'></div>" +
			"<div class = 'fade " + stim_side[1 - choice] + "' style='background:" + curr_colors[stage + 1] +
			"; '>" +
			"<img class = 'decision-stim' src= '" + curr_images[second_notselected] + "'></div>"
	} else {
		second_selected = -1
		jsPsych.data.addDataToLastTrial({
			stim_selected: second_selected
		})
	}

}

/*
After each trial the FB_matrix is updated such that each of the 4 reward probabilities changes by a random amount
parametrized a Gaussian. Reward probabilities are bound by 25% and 75%
*/
var update_FB = function() {
	for (i = 0; i < FB_matrix.length; i++) {
		var curr_value = FB_matrix[i]
		var step = normal_random(0, 0.025 * 0.025)
		console.log("curr_value= "+ curr_value);
		console.log("step= "+ step);
		if (curr_value + step < 0.75 && curr_value + step > 0.25) {
			FB_matrix[i] = curr_value + step
		} else {
			FB_matrix[i] = curr_value - step
		}
	}
}

/*
If no choice was taken during the second stage display a reminder.
Otherwise, check the FB_matrix which determines the reward probabilities for each stimulus (there are 4 final stimulus associated with rewards:
2 for each of the 2 second stages). Flip a coin using the relevant probability and give FB.

After FB, the FB_atrix is updated.
*/
var get_feedback = function() {
<<<<<<< HEAD
	console.log("second_selected"+ (second_selected - 2));
	console.log("FB_selected ="+ FB_matrix[second_selected - 2]);
	console.log("FB_selected="+ (FB_matrix[second_selected - 2][current_trial]) );
	console.log("FB_0 ="+ FB_matrix[0][current_trial] + "FB_1 ="+ FB_matrix[1][current_trial] + "FB_2 ="+ FB_matrix[2][current_trial] + "FB_3 ="+ FB_matrix[3][current_trial] );
	console.log("FB_all ="+ FB_matrix);

	if (second_selected == -1) {
		return "<div class = centerbox><div class = center-text>" +
			"Please respond faster!</div></div>"
	} else if (Math.random() < FB_matrix[second_selected - 2][current_trial]) {

		//update_FB();
		FB = 1
		total_score += 1
		// return "<div class = 'decision-top faded' style='background:" + curr_colors[stage + 1] + "; '>" +
		// 	"<img class = 'decision-stim' src= '" + curr_images[second_selected] + "'></div>" +
		// 	"<div><img  class = decision-fb src = 'images/gold_coin.png'></img></div>"
		//
		return "<div><img  class = decision-fb src = 'images/gold_coin.png'></img></div>"
		 //*S*	"<div class = 'decision-top faded' style='background:" + curr_colors[stage + 1] + "; '>" +
=======
	console.log("stim_ids " +stim_ids)
	if (second_selected == -1) {
		return "<div class = centerbox><div class = center-text>" +
			"Please respond faster!</div></div>"
	} else if (Math.random() < FB_matrix[second_selected - 2]) {
		var fb_img = 0
		var bg_imf = 0
		update_FB();
		FB = 1
		total_score += 1
		if (stim_ids[0] == 2 || stim_ids[0] == 3){
				fb_img = terminal_state_img[0]
				bg_img = background_Image_stage_2_green
		}else{
				fb_img = terminal_state_img[2]
				bg_img = background_Image_stage_2_purpel
		}
		return 	"<img class = 'background_images' src= '" + bg_img + "'> </img></div>" +
						"<img  class = 'decision-stim' src ='" + fb_img + "'></div>"

		//return "<div><img  class = decision-fb src = 'images/gold_coin.png'></img></div>"

	   //*S*	"<div class = 'decision-top faded' style='background:" + curr_colors[stage + 1] + "; '>" +
>>>>>>> 31df187631c61123835ac539b21ddd85bd321c77
		//*S*	"<img class = 'decision-stim' src= '" + curr_images[second_selected] + "'></div>" +

	} else {
	//	update_FB();
		FB = 0
		if (stim_ids[0] == 2 ||stim_ids[0] == 3){
			 	fb_img = terminal_state_img[1]
				bg_img = background_Image_stage_2_green
		}else{
				fb_img = terminal_state_img[3]
				bg_img = background_Image_stage_2_purpel
		}

		return 	"<img class = 'background_images' src= '" + bg_img + "'> </img></div>" +
						"<img  class = 'decision-stim' src ='" + fb_img + "'> </div>"
		// return "<div style = text-align:center><p class = decision-fb style = 'color:red;font-size:120px'>0!</p></div>"
		  //*S*"<div class = 'decision-top faded' style='background:" + curr_colors[stage + 1] + "; '>" +
			//*S* "<img class = 'decision-stim' src= '" + curr_images[second_selected] + "'></div>" +
	}
}

var update_FB_data = function() {
	jsPsych.data.addDataToLastTrial({
		feedback: FB,
		trial_num: current_trial,
		FB_probs: FB_matrix.slice(0)
	})
	return ""
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.62
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true
var performance_var = 0

// task specific variables
var total_score = 0 //track performance
var practice_trials_num = 1
var test_trials_num = 20
var stim_ids = [] //Tracks the ids of the last chosen stims.
var current_trial = -1
var first_selected = -1 //Tracks the ID of the selected fs stimulus
var second_selected = -1 //Tracks the ID of the selected fs stimulus
var FB_on = 1 //tracks whether FB should be displayed on this trial
var FB = -1 //tracks FB value
var stage = 0 //stage is used to track which second stage was shown, 0 or 1
var transition = ''
//*S* var FB_matrix = initialize_FB_matrix() //tracks the reward probabilities for the four final stimulus
var exp_stage = 'practice'

//*S* FB_matrix Rndwlk version

var FB_matrix1 = [];
	FB_matrix1[0] = [0.33772,0.39326,0.40412,0.45749,0.48324,0.48626,0.45786,0.42262,0.49357,0.50731,0.54289,0.53135,0.50034,0.49953,0.48937,0.50251,0.53868,0.52203,0.49471,0.45876,0.52796,0.50268,0.46898,0.4837,0.47281,0.48038,0.42808,0.39279,0.37639,0.36649,0.35582,0.35915,0.38079,0.37371,0.37682,0.41413,0.39547,0.44378,0.46997,0.47091,0.50357,0.53194,0.51394,0.52503,0.53825,0.54097,0.49772,0.50029,0.48817,0.50105,0.45351,0.46345,0.50613,0.51335,0.56239,0.56169,0.56903,0.5471,0.50874,0.53747,0.50208,0.51419,0.53481,0.47552,0.48684,0.51724,0.49535,0.51149,0.53235,0.4978,0.47696,0.47291,0.48077,0.4425,0.48969,0.52356,0.54573,0.49781,0.52555,0.50405,0.519,0.51776,0.49547,0.48375,0.45753,0.5155,0.51645,0.50343,0.47022,0.47794,0.51657,0.52218,0.52722,0.5297,0.52667,0.56737,0.6445,0.63256,0.59317,0.5313];
	FB_matrix1[1] = [0.25704,0.25686,0.26537,0.32215,0.2977,0.31559,0.29018,0.24321,0.24308,0.27374,0.28045,0.31219,0.3303,0.30804,0.37726,0.40205,0.37142,0.34159,0.31001,0.30259,0.25156,0.28041,0.29775,0.33556,0.33383,0.27651,0.31895,0.3416,0.31953,0.27126,0.28677,0.27745,0.23634,0.18869,0.1756,0.16868,0.16833,0.16272,0.16272,0.16828,0.23888,0.215,0.2362,0.2198,0.25504,0.24835,0.23921,0.25358,0.28813,0.29193,0.30125,0.26231,0.25296,0.28666,0.26313,0.2301,0.21956,0.20996,0.25839,0.28052,0.32197,0.35135,0.36251,0.35102,0.37592,0.41482,0.46239,0.46043,0.50986,0.56564,0.59565,0.62044,0.56731,0.55831,0.58139,0.58884,0.54916,0.5071,0.51807,0.54408,0.56728,0.52195,0.55915,0.53774,0.53981,0.52355,0.46647,0.4676,0.45075,0.48408,0.55282,0.54373,0.53274,0.53184,0.53568,0.49976,0.50574,0.552,0.51679,0.53681];
	FB_matrix1[2] = [0.5917,0.64769,0.70574,0.68713,0.68242,0.70379,0.71255,0.70272,0.67069,0.65692,0.65933,0.64338,0.65085,0.64829,0.69846,0.71015,0.70442,0.74258,0.7554,0.73006,0.75518,0.72853,0.74084,0.68069,0.71271,0.68525,0.67073,0.67068,0.648,0.67646,0.70308,0.68574,0.71904,0.71133,0.73911,0.74918,0.73149,0.70956,0.68745,0.69793,0.6233,0.62599,0.66243,0.69599,0.68707,0.649,0.60675,0.59887,0.63346,0.69691,0.66782,0.69997,0.72736,0.70792,0.67461,0.6478,0.65467,0.6329,0.6158,0.60556,0.64038,0.63054,0.58793,0.56423,0.55994,0.56647,0.54658,0.49899,0.50783,0.57898,0.54492,0.48585,0.48109,0.48699,0.46963,0.48634,0.46603,0.47676,0.45376,0.40843,0.39107,0.40562,0.35266,0.33274,0.31999,0.34656,0.37718,0.37391,0.38179,0.40437,0.4088,0.33946,0.33295,0.31311,0.32477,0.37747,0.36431,0.35193,0.33457,0.32013];
	FB_matrix1[3] = [0.37146,0.29856,0.30642,0.2707,0.25356,0.25763,0.1921,0.20666,0.19305,0.19291,0.18298,0.18156,0.19481,0.15628,0.18232,0.21027,0.20945,0.22949,0.20882,0.23431,0.24699,0.19052,0.2206,0.21146,0.19117,0.21937,0.23521,0.27283,0.33207,0.33282,0.3137,0.32797,0.33243,0.33035,0.37739,0.38959,0.39165,0.43298,0.4753,0.45643,0.46237,0.46749,0.47418,0.47148,0.46565,0.48012,0.51917,0.56677,0.551,0.52118,0.5035,0.51614,0.48258,0.4852,0.51321,0.5236,0.54053,0.58072,0.58066,0.60732,0.60788,0.62424,0.61417,0.61129,0.61249,0.63833,0.6153,0.64763,0.66878,0.65734,0.66195,0.66565,0.68452,0.66885,0.6788,0.69809,0.6875,0.69827,0.6978,0.72358,0.7295,0.74277,0.73044,0.74494,0.74108,0.74222,0.74686,0.80182,0.80182,0.82339,0.81468,0.81121,0.84829,0.83158,0.83158,0.80201,0.74137,0.72785,0.73865,0.76278];

var	FB_matrix2 = [];
		FB_matrix2[0] = [0.33772,0.39326,0.40412,0.45749,0.48324,0.48626,0.45786,0.42262,0.49357,0.50731,0.54289,0.53135,0.50034,0.49953,0.48937,0.50251,0.53868,0.52203,0.49471,0.45876,0.52796,0.50268,0.46898,0.4837,0.47281,0.48038,0.42808,0.39279,0.37639,0.36649,0.35582,0.35915,0.38079,0.37371,0.37682,0.41413,0.39547,0.44378,0.46997,0.47091,0.50357,0.53194,0.51394,0.52503,0.53825,0.54097,0.49772,0.50029,0.48817,0.50105,0.45351,0.46345,0.50613,0.51335,0.56239,0.56169,0.56903,0.5471,0.50874,0.53747,0.50208,0.51419,0.53481,0.47552,0.48684,0.51724,0.49535,0.51149,0.53235,0.4978,0.47696,0.47291,0.48077,0.4425,0.48969,0.52356,0.54573,0.49781,0.52555,0.50405,0.519,0.51776,0.49547,0.48375,0.45753,0.5155,0.51645,0.50343,0.47022,0.47794,0.51657,0.52218,0.52722,0.5297,0.52667,0.56737,0.6445,0.63256,0.59317,0.5313];
		FB_matrix2[1] = [0.25704,0.25686,0.26537,0.32215,0.2977,0.31559,0.29018,0.24321,0.24308,0.27374,0.28045,0.31219,0.3303,0.30804,0.37726,0.40205,0.37142,0.34159,0.31001,0.30259,0.25156,0.28041,0.29775,0.33556,0.33383,0.27651,0.31895,0.3416,0.31953,0.27126,0.28677,0.27745,0.23634,0.18869,0.1756,0.16868,0.16833,0.16272,0.16272,0.16828,0.23888,0.215,0.2362,0.2198,0.25504,0.24835,0.23921,0.25358,0.28813,0.29193,0.30125,0.26231,0.25296,0.28666,0.26313,0.2301,0.21956,0.20996,0.25839,0.28052,0.32197,0.35135,0.36251,0.35102,0.37592,0.41482,0.46239,0.46043,0.50986,0.56564,0.59565,0.62044,0.56731,0.55831,0.58139,0.58884,0.54916,0.5071,0.51807,0.54408,0.56728,0.52195,0.55915,0.53774,0.53981,0.52355,0.46647,0.4676,0.45075,0.48408,0.55282,0.54373,0.53274,0.53184,0.53568,0.49976,0.50574,0.552,0.51679,0.53681];
		FB_matrix2[2] = [0.5917,0.64769,0.70574,0.68713,0.68242,0.70379,0.71255,0.70272,0.67069,0.65692,0.65933,0.64338,0.65085,0.64829,0.69846,0.71015,0.70442,0.74258,0.7554,0.73006,0.75518,0.72853,0.74084,0.68069,0.71271,0.68525,0.67073,0.67068,0.648,0.67646,0.70308,0.68574,0.71904,0.71133,0.73911,0.74918,0.73149,0.70956,0.68745,0.69793,0.6233,0.62599,0.66243,0.69599,0.68707,0.649,0.60675,0.59887,0.63346,0.69691,0.66782,0.69997,0.72736,0.70792,0.67461,0.6478,0.65467,0.6329,0.6158,0.60556,0.64038,0.63054,0.58793,0.56423,0.55994,0.56647,0.54658,0.49899,0.50783,0.57898,0.54492,0.48585,0.48109,0.48699,0.46963,0.48634,0.46603,0.47676,0.45376,0.40843,0.39107,0.40562,0.35266,0.33274,0.31999,0.34656,0.37718,0.37391,0.38179,0.40437,0.4088,0.33946,0.33295,0.31311,0.32477,0.37747,0.36431,0.35193,0.33457,0.32013];
		FB_matrix2[3] = [0.37146,0.29856,0.30642,0.2707,0.25356,0.25763,0.1921,0.20666,0.19305,0.19291,0.18298,0.18156,0.19481,0.15628,0.18232,0.21027,0.20945,0.22949,0.20882,0.23431,0.24699,0.19052,0.2206,0.21146,0.19117,0.21937,0.23521,0.27283,0.33207,0.33282,0.3137,0.32797,0.33243,0.33035,0.37739,0.38959,0.39165,0.43298,0.4753,0.45643,0.46237,0.46749,0.47418,0.47148,0.46565,0.48012,0.51917,0.56677,0.551,0.52118,0.5035,0.51614,0.48258,0.4852,0.51321,0.5236,0.54053,0.58072,0.58066,0.60732,0.60788,0.62424,0.61417,0.61129,0.61249,0.63833,0.6153,0.64763,0.66878,0.65734,0.66195,0.66565,0.68452,0.66885,0.6788,0.69809,0.6875,0.69827,0.6978,0.72358,0.7295,0.74277,0.73044,0.74494,0.74108,0.74222,0.74686,0.80182,0.80182,0.82339,0.81468,0.81121,0.84829,0.83158,0.83158,0.80201,0.74137,0.72785,0.73865,0.76278];

var FB_matrix = FB_matrix2 //assign rnwlk version 1 or 2



// Actions go or no-go
var choices_1 = []
// Actions for left and right
var choices = [37, 39]
var stim_side = ['decision-left', 'decision-right']
var stim_move = ['selected-left', 'selected-right']

// Set up colors
// var test_colors = jsPsych.randomization.shuffle(['#98bf21', '#FF9966', '#C2C2FF'])
// var practice_colors = jsPsych.randomization.shuffle(['#F1B8D4', '#CCFF99', '#E0C2FF'])
var test_colors = jsPsych.randomization.shuffle(['#98bf2100', '#FF996600', '#C2C2FF00'])
var practice_colors = jsPsych.randomization.shuffle(['#98bf2100', '#FF996600', '#C2C2FF00'])
//*S* var test_colors = jsPsych.randomization.shuffle(['#98bf21', '#FF9966', '#C2C2FF'])
//*S* var practice_colors = jsPsych.randomization.shuffle(['#00F1B8D4', '#00CCFF99', '#00E0C2FF'])
var curr_colors = practice_colors

//The first two stims are first-stage stims.
//The next four are second-stage
// var test_images = jsPsych.randomization.repeat(
// 	["images/11.png",
// 		"images/12.png",
// 		"images/13.png",
// 		"images/14.png",
// 		"images/15.png",
// 		"images/16.png",
// 	], 1)
var test_images =

		[
			"img_s_y/blue_boat_left.png",
			"img_s_y/orange_boat_right.png",
			"img_s_y/green_shell_1.png",
			"img_s_y/green_shell_2.png",
			"img_s_y/purpel_shell_1.png",
			"img_s_y/purpel_shell_2.png",
		]

var fb_images = [
	"stimulus/blue_shell_pearl.png",
	"images/gold_coin.png",

]

var practice_images = jsPsych.randomization.repeat(
	["images/80.png",
		"images/81.png",
		"images/82.png",
		"images/83.png",
		"images/84.png",
		"images/85.png",
	], 1)

	//*S* set background Image
var background_Image_stage_1 = "img_s_y/background_1.png"
var background_Image_stage_2_green = "img_s_y/green_background.png"
var background_Image_stage_2_purpel = "img_s_y/purple_background.png"

var terminal_state_img = ["img_s_y/green_pearl.png",
											"img_s_y/green_no_pearl.png",
											"img_s_y/purpel_pearl.png",
											"img_s_y/purple_no_pearl.png"
											]

var strategy_stim = ["stimulus/right_arrow_white.png","stimulus/left_arrow_white.png","stimulus/no_go_white.png"]

//Preload images
jsPsych.pluginAPI.preloadImages(practice_images)
jsPsych.pluginAPI.preloadImages(test_images)
jsPsych.pluginAPI.preloadImages(background_Image_stage_1)
jsPsych.pluginAPI.preloadImages(background_Image_stage_2_green)
jsPsych.pluginAPI.preloadImages(background_Image_stage_2_purpel)
jsPsych.pluginAPI.preloadImages(terminal_state_img)


var curr_images = practice_images

var test_fs_stim = get_fs_stim(test_images, test_colors)
var practice_fs_stim = get_fs_stim(practice_images, practice_colors)

var test_ss_stim = get_ss_stim(test_images, test_colors)
var practice_ss_stim = get_ss_stim(practice_images, practice_colors)

var test_fs_stims = jsPsych.randomization.repeat(test_fs_stim, test_trials_num, true);
var practice_fs_stims = jsPsych.randomization.repeat(practice_fs_stim, practice_trials_num, true);


var curr_fs_stims = practice_fs_stims
var curr_ss_stims = practice_ss_stim


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: 'attention_check'
	},
	timing_response: 180000,
	response_ends_trial: true,
	timing_post_trial: 200
}

var attention_node = {
	timeline: [attention_check_block],
	conditional_function: function() {
		return run_attention_checks
	}
}

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: 'attention_check'
	},
	timing_response: 180000,
	response_ends_trial: true,
	timing_post_trial: 200
}


var feedback_instruct_text =
	'Welcome to the experiment. This task will take about 25 minutes. \
	Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'instruction'
	},
	cont_key: [13],
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};

/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: 'instruction'
	},
	pages: [
		"<div class = centerbox> \
		<p class = block-text> Welcome! </p> \
		<p class = block-text> Here is a example round <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> </p> \
		<div class = decision-left style='background:" + curr_colors[0] + ";'>  \
		<img class = 'decision-stim' src= '" + curr_images[0] +"'> </img> \
		<img class = 'strategy_stim' src= '" + strategy_stim[2] +"'> </img></div> \
		<div class = decision-right style='background:" + curr_colors[0] +"; '> \
		<img class = 'decision-stim' src= '" + curr_images[1] + "'></img> \
		<img class = 'strategy_stim' src= '" + strategy_stim[0] +"'> </img> </div></div>",
		'<div class = centerbox> <p class = block-text> \
		Each second stage has its own background color and has two different abstract shapes.</p> \
		<p class = block-text> In total, the task has three "stages": a first stage which can lead to either stage 2a or stage 2b, \
		each with their own background color and shapes.</p></div>',
		'<div class = centerbox> \
		<p class = block-text> Each first-stage choice is primarily associated with one of the two second-stages. \
		This means that each first-stage choice is more likely to bring you to one of the two second-stages than the other.</p>\
		<p class = block-text>After you end these instructions you will see an example trial.</p> \
		</div>'
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
}

var instruction_node = {
	timeline: [feedback_instruct_block, instructions_block],
	/* This function defines stopping criteria */
	loop_function: function(data) {
		for (i = 0; i < data.length; i++) {
			if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
				rt = data[i].rt
				sumInstructTime = sumInstructTime + rt
			}
		}
		if (sumInstructTime <= instructTimeThresh * 1000) {
			feedback_instruct_text =
				'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = 'Done with instructions. Press <strong>enter</strong> to continue.'
			return false
		}
	}
}

var second_instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: 'instruction'
	},
	pages: [
		'<div class = centerbox><p class = block-text>As you saw, you get feedback after your second-stage choice: either a gold coin or a red "0". The gold coins determine your bonus pay, so try to get as many as possible!</p><p class = block-text>As mentioned, there are four second-stage shapes: two shapes in 2a and two shapes in 2b. These four shapes each have a different chance of paying a gold coin. You want to learn which shape is the best so you can get as many coins as possible.</p></div>',
		'<div class = centerbox><p class = block-text>The chance of getting a coin from each second-stage shape changes over the experiment, so the best choice early on may not be the best choice later.</p><p class = block-text>In contrast, the chance of going to one of the second-stages after choosing one of the first-stage choices is fixed throughout the experiment. If you find over time that one first-stage shape brings you to 2a most of the time, it will stay that way for the whole experiment.</p></div>',
		'<div class = centerbox><p class = block-text>After you end instructions we will start with some practice.</p><p class = block-text>After practice we will show you the instructions again, but please make sure you understand them as well as you can now.</p></div>'
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
}

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'end',
    	exp_id: 'two_stage_decision'
	},
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_response: 180000,
	timing_post_trial: 0,
	on_finish: assessPerformance
};

var wait_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'wait'
	},
	text: '<div class = centerbox><p class = center-block-text>Take a break!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_response: 120000,
	timing_post_trial: 1000
};

var start_practice_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'practice_intro'
	},
	text: '<div class = centerbox><p class = center-block-text>Starting practice. Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_response: 180000,
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'test_intro'
	},
	text: "<div class = centerbox><p class = block-text>Finished with practice. We will now start the test with new shapes and stages.</p><p class = block-text>Just like in the practice, each first-stage choice is primarily associated with one second-stage and each second-stage shape has a different chance of earning a point. Each second-stage shape's chance of earning a gold coin changes over the expeirment, so the best shape early on may not be the best shape later. In contrast, once you learn which stage a first-stage choice brings you to most of the time, it will stay the same for the whole experiment.</p><p class = block-text>Your task is to earn as many gold coins as possible. Press <strong>enter</strong> to begin.</p></div>",
	cont_key: [13],
	timing_response: 180000,
	timing_post_trial: 1000
};

var intertrial_wait_update_FB = {
	type: "poldrack-single-stim",
	data: {
		trial_id: 'wait_update_FB'
	},
	stimulus: update_FB_data, //dummy stimulus. Returns "" but updates previous trial
	is_html: true,
	timing_post_trial: 0,
	timing_stim: 1000,
	timing_response: 1000
}

var intertrial_wait = {
	type: "poldrack-single-stim",
	data: {
		trial_id: 'wait'
	},
	stimulus: " ", //dummy stimulus. Returns "" but updates previous trial
	is_html: true,
	timing_post_trial: 0,
	timing_stim: 1000,
	timing_response: 1000
}

var change_phase_block = {
	type: 'call-function',
	data: {
		trial_id: 'change_phase'
	},
	func: change_phase,
	timing_post_trial: 0
}

//experiment blocks
var first_stage = {
	type: "poldrack-single-stim",
	stimulus: choose_first_stage,
	is_html: true,
	choices: choices_1,
	timing_stim: 2000,
	timing_response: 2000,
	show_response: true,
	timing_post_trial: 0,
	response_ends_trial: false,
	// stage : 1,
	data: {
		trial_id: 'first_stage'
	},
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage,
			trial_num: current_trial,
			stim_order: stim_ids,
			stage: 0
		})
	}
}

var first_stage_selected = {
	type: "poldrack-single-stim",
	data: {
		trial_id: 'first_stage_selected'
	},
	stimulus: get_first_selected,
	choices: 'none',
	is_html: true,
	timing_post_trial: 0,
	timing_response: 1000,
	stage : 1,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	}
}

var second_stage = {
	type: "poldrack-single-stim",
	data: {
		trial_id: 'second_stage'
	},
	stimulus: choose_second_stage,
	is_html: true,
	choices: choices,
	timing_stim: 2000,
	timing_response: 2000,
	response_ends_trial: true,
	timing_post_trial: 0,
	// stage: 2,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage,
			trial_num: current_trial,
			stim_order: stim_ids,
			stage: stage + 1,
			stage_transition: transition
		})
	}
}

var second_stage_selected = {
	type: "poldrack-single-stim",
	data: {
		trial_id: 'second_stage_selected'
	},
	stimulus: get_second_selected,
	choices: 'none',
	is_html: true,
	timing_post_trial: 0,
	timing_response: 1000,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	}
}

var FB_stage = {
	type: "poldrack-single-stim",
	data: {
		trial_id: 'feedback_stage'
	},
	stimulus: get_feedback,
	is_html: true,
	choices: 'none',
	timing_response: 500,
	continue_after_response: false,
	timing_post_trial: 0,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	}
}

var FB_node = {
	timeline: [second_stage_selected, FB_stage, intertrial_wait_update_FB],
	conditional_function: function() {
		return FB_on == 1
	}
}

var noFB_node = {
	timeline: [intertrial_wait],
	conditional_function: function() {
		return FB_on === 0
	}
}

var two_stage_decision_experiment = []
two_stage_decision_experiment.push(instruction_node);
//example trial
two_stage_decision_experiment.push(first_stage)
two_stage_decision_experiment.push(first_stage_selected)
two_stage_decision_experiment.push(second_stage)
two_stage_decision_experiment.push(FB_node)
two_stage_decision_experiment.push(noFB_node)
//continue instructions
two_stage_decision_experiment.push(second_instructions_block);
two_stage_decision_experiment.push(start_practice_block);
two_stage_decision_experiment.push(attention_node)
for (var i = 0; i < practice_trials_num; i++) {
	two_stage_decision_experiment.push(first_stage)
	two_stage_decision_experiment.push(first_stage_selected)
	two_stage_decision_experiment.push(second_stage)
	two_stage_decision_experiment.push(FB_node)
	two_stage_decision_experiment.push(noFB_node)
}
two_stage_decision_experiment.push(attention_node)
two_stage_decision_experiment.push(change_phase_block)
two_stage_decision_experiment.push(start_test_block)
for (var i = 0; i < test_trials_num / 2; i++) {
	two_stage_decision_experiment.push(first_stage)
	two_stage_decision_experiment.push(first_stage_selected)
	two_stage_decision_experiment.push(second_stage)
	two_stage_decision_experiment.push(FB_node)
	two_stage_decision_experiment.push(noFB_node)
}
two_stage_decision_experiment.push(attention_node)
two_stage_decision_experiment.push(wait_block)
for (var i = 0; i < test_trials_num / 2; i++) {
	two_stage_decision_experiment.push(attention_node)
	two_stage_decision_experiment.push(first_stage)
	two_stage_decision_experiment.push(first_stage_selected)
	two_stage_decision_experiment.push(second_stage)
	two_stage_decision_experiment.push(FB_node)
	two_stage_decision_experiment.push(noFB_node)
}
two_stage_decision_experiment.push(attention_node)
two_stage_decision_experiment.push(post_task_block)
two_stage_decision_experiment.push(end_block)
