(function(dust){dust.register("dashboard_client",body_0);function body_0(chk,ctx){return chk.w("<!DOCTYPE html><html lang=\"en\">").p("dashboard_partials/head",ctx,ctx,{"css":"/css/client.css"}).w("<body class=\"has-fixed-sidenav\" data-gr-c-s-loaded=\"true\">").p("dashboard_partials/header",ctx,ctx,{"name":"John Doe","profile-picture":"https://randomuser.me/api/portraits/men/61.jpg"}).w("<main><div class=\"container\"><div class=\"masonry row\" style=\"position: relative; height: 2134.14px;\"><div class=\"col s12\" style=\"position: absolute; left: 0px; top: 0px;\"><h2 class=\"text-flow\">Dashboard</h2></div><div class=\"col m6 s12\" style=\"position: absolute; left: 344px; top: 107px;\"><div class=\"card\"><div class=\"card-content\"><span class=\"flow-text card-title\">Today's Workout</span></div>").p("dashboard_partials/schedule_table",ctx,ctx,{}).w("</div><div class=\"row center-align\"><div class=\"col m6 s12\"><a class=\"btn-large black\">Begin Workout</a></div><div class=\"col m6 s12\"><a class=\"btn-large black disabled\">Contact Coach</a></div></div></div>").p("dashboard_partials/progress_graph",ctx,ctx,{}).w("</div></div></main>").p("dashboard_partials/footer",ctx,ctx,{}).w("</body></html>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("dashboard_coach",body_0);function body_0(chk,ctx){return chk.w("<!DOCTYPE html><html lang=\"en\">").p("dashboard_partials/head",ctx,ctx,{"css":"/css/coach.css"}).w("<body class=\"has-fixed-sidenav\" data-gr-c-s-loaded=\"true\" onload=\"renderClients()\">").p("dashboard_partials/header",ctx,ctx,{"name":body_1,"profile-picture":"/img/icons/user-pic.png"}).w("<main><div class=\"container\"><div class=\"masonry row\" style=\"position: relative; height: 2134.14px;\"><div class=\"col s12\" style=\"position: absolute; left: 0px; top: 0px;\"><h2 class=\"center\">Dashboard</h2></div>").p("dashboard_partials/graph",ctx,ctx,{}).p("dashboard_partials/composed_graph",ctx,ctx,{}).w("</div>").p("dashboard_partials/schedule",ctx,ctx,{"coach":"true"}).w("</div></div></main>").p("dashboard_partials/footer",ctx,ctx,{}).w("</body><script src=\"/js/resources/dustjs-linkedin/dust-core.min.js\"></script><script src=\"/js/schedule.js\"></script><script src=\"/js/views.js\"></script><script src=\"/js/helper.js\"></script></html>");}body_0.__dustBody=!0;function body_1(chk,ctx){return chk.f(ctx.getPath(false, ["user","firstName"]),ctx,"h");}body_1.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("dashboard_coach_clients",body_0);function body_0(chk,ctx){return chk.w("<!DOCTYPE html><html lang=\"en\">").p("dashboard_partials/head",ctx,ctx,{"css":"/css/coach.css"}).w("<body class=\"has-fixed-sidenav\" data-gr-c-s-loaded=\"true\">").p("dashboard_partials/header",ctx,ctx,{"name":"Coach Ramon","profile-picture":"/img/icons/user-pic.png"}).w("<main><div class=\"container\"><h2 class=\"center\">All Clients</h2><p> wofofdfdsok </p></div></div></div></main>").p("dashboard_partials/footer",ctx,ctx,{}).w("</body></html>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("error",body_0);function body_0(chk,ctx){return chk.w("<!DOCTYPE html><html><head><title>").f(ctx.get(["title"], false),ctx,"h").w("</title><link rel='stylesheet' href='/stylesheets/style.css' /></head><body><h1>").f(ctx.get(["message"], false),ctx,"h").w("</h1><h2>").f(ctx.getPath(false, ["error","status"]),ctx,"h").w("</h2><pre>").f(ctx.getPath(false, ["error","stack"]),ctx,"h").w("</pre></body></html>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("index",body_0);function body_0(chk,ctx){return chk.w("<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale = 1.0, maximum-scale=1.0, user-scalable=no\" /><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>").f(ctx.get(["title"], false),ctx,"h").w(" | Home</title><link href=\"https://fonts.googleapis.com/css?family=Poppins:400,500,600,700,800\" rel=\"stylesheet\"><link rel=\"stylesheet\" href=\"/css/style.css\"><link rel=\"stylesheet\" href=\"/css/grid.css\"><link rel=\"stylesheet\" href=\"/css/layout.css\"><link rel=\"stylesheet\" href=\"/css/index_style.css\"><link rel=\"stylesheet\" href=\"/css/header.css\"><link rel=\"stylesheet\" href=\"/css/nav.css\"><link rel=\"stylesheet\" href=\"/css/footer.css\"></head><body>").p("partials/header",ctx,ctx,{}).w("<section class=\"container mb-5\"><div class=\"row\"><div class=\" col-lg-6 col-xs-12\"><h1 id=\"about\" class=\"heading--gradient\">About PushApp</h1><div class=\"row\"><p class=\"col-lg-12 col-xs-12 paragraph-text mb-3\">Lorem, ipsum dolor sit amet consecteturadipisicing elit.Soluta,molestiasidullam tempora atque,quisquamconsequuntur, quis blanditiis et officia doloribus sed tenetur quod non. Expedita beatae modi idconsequaturnatus facere doloremque tenetur molestias quae eum quia esse laborum quos, unde adipisci enim!Ipsummagnitemporibus sapiente corrupti ullam.</p><a class=\"col-xs-12 col-lg-12 mb-center btn btn--gradient mt-1\" href=\"/register\">Enroll</a></div></div><div class=\"col-lg-6 col-xs-12\"><img class=\"thumbnail-square\" src=\"/img/img-modal-1.jpg\" alt=\"\"></div></div></section><section class=\"clip-top-bottom section-background--grey mt-4 mb-5\"><h1 class=\"heading--gradient text-center\">Features</h1><div class=\"container mt-4\"><div class=\"row\"><div class=\"card col-lg-4 col-xs-12\"><img src=\"/img/icons/man-dumbell.svg\" alt=\"man with dumbell icon\"><h2>Create routines</h2><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio tempora temporibus praesentiummollitia</p></div><div class=\"card col-lg-4 col-xs-12\"><img src=\"/img/icons/coach.svg\" alt=\"man with dumbell icon\"><h2>Hire coaches</h2><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio tempora temporibus praesentiummollitia</p></div><div class=\"card col-lg-4 col-xs-12\"><img src=\"/img/icons/support.svg\" alt=\"man with dumbell icon\"><h2>Real-Time Support</h2><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio tempora temporibus praesentiummollitia</p></div></div></div></section><section class=\"section-trainers\"><h1><span class=\"span-main\">Our Best </span><span class=\"span-secondary\">Trainers</span></h1><div class=\"container mt-4 mb-5\"><div class=\"row\"><div class=\" card-image-bg col-lg-4 col-xs-12\"><img src=\"/img/trainers/trainer-img-1.png\" alt=\"\"><h2>Sarah Connor</h2><p>LLorem ipsum dolor sit amet consectetur adipisicing elit. Odio tempora temporibus praesentiummollitia</p><div class=\"social-networks\"><a href=\"#\"><img src=\"/img/social-networks/instagram-logo.svg\" alt=\"\"></a><a href=\"#\"><img src=\"/img/social-networks/facebook-logo.svg\" alt=\"\"></a><a href=\"#\"><img src=\"/img/social-networks/twitter-logo.svg\" alt=\"\"></a></div></div><div class=\"card-image-bg col-lg-4 col-xs-12\"><img src=\"/img/trainers/trainer-img-2.png\" alt=\"\"><h2>Romeo Santos</h2><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio tempora temporibus praesentiummollitia</p><div class=\"social-networks\"><a href=\"#\"><img src=\"/img/social-networks/instagram-logo.svg\" alt=\"\"></a><a href=\"#\"><img src=\"/img/social-networks/facebook-logo.svg\" alt=\"\"></a><a href=\"#\"><img src=\"/img/social-networks/twitter-logo.svg\" alt=\"\"></a></div></div><div class=\"card-image-bg col-lg-4 col-xs-12\"><img src=\"/img/trainers/trainer-img-3.png\" alt=\"\"><h2>Becky G</h2><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio tempora temporibus praesentiummollitia</p><div class=\"social-networks\"><a href=\"#\"><img src=\"/img/social-networks/instagram-logo.svg\" alt=\"\"></a><a href=\"#\"><img src=\"/img/social-networks/facebook-logo.svg\" alt=\"\"></a><a href=\"#\"><img src=\"/img/social-networks/twitter-logo.svg\" alt=\"\"></a></div></div></div></div></section>").p("partials/footer",ctx,ctx,{}).w("</body></html>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("login",body_0);function body_0(chk,ctx){return chk.w("<!DOCTYPE html><html><head><title>LOGIN</title></head><body><form onsubmit=\"getActiveUser(document.getElementById('user').value)\" action=\"/login\" method=\"post\" enctype=\"application/x-www-form-urlencoded\"><div><label>Username:<input required id=\"user\" type=\"text\" name=\"username\"/></label></div><div><label>Password:<input required type=\"password\" name=\"password\"/></label></div><div><input type=\"submit\" value=\"Login\"/></div></form><script src=\"/js/helper.js\"></script></body></html>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("user-settings",body_0);function body_0(chk,ctx){return chk.w("<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale = 1.0, maximum-scale=1.0, user-scalable=no\" /><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>PushApp | Client Setting</title><link href=\"https://fonts.googleapis.com/css?family=Poppins:400,500,600,700,800\" rel=\"stylesheet\"><link rel=\"stylesheet\" href=\"/css/style.css\"><link rel=\"stylesheet\" href=\"/css/grid.css\"><link rel=\"stylesheet\" href=\"/css/layout.css\"><link rel=\"stylesheet\" href=\"/css/index_style.css\"><link rel=\"stylesheet\" href=\"/css/header.css\"><link rel=\"stylesheet\" href=\"/css/nav.css\"><link rel=\"stylesheet\" href=\"/css/footer.css\"></head><body><div></div><h2>Change settings of coach</h2><form action=\"/edit/").f(ctx.get(["_id"], false),ctx,"h").w("?_method=PUT\" method=\"POST\" enctype=\"application/x-www-form-urlencoded\">").p("partials/register",ctx,ctx,{}).w("</form></body></html>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("workout",body_0);function body_0(chk,ctx){return chk.w("<!DOCTYPE html><html lang=\"en\"><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"><meta name=\"viewport\" content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><meta name=\"msapplication-tap-highlight\" content=\"no\"><meta name=\"description\" content=\"\"><title>Workout</title><!-- Materialize--><link href=\"//cdn.shopify.com/s/files/1/1775/8583/t/1/assets/admin-materialize.min.css?0\" rel=\"stylesheet\"><!-- Material Icons--><link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\"><link rel=\"stylesheet\" href=\"/css/workout.css\"></head><body class=\"\"><div class=\"container center-content\"><div class=\"row\"><div class=\"col l2 m3 s3\"><a id=\"pause-continue\" onclick=\"chronoPauseOrContinue()\" class=\"btn-huge left\"><i class=\"material-icons\">pause</i></a></div><div class=\"col l8 m6 s6\"><h1 onload=\"chronoStart()\" id=\"chronometer\" class=\"white-text\">00:00:00</h1></div><div class=\"col l2 m3 s3\"><a onclick=\"chronoReset()\" class=\"btn-huge right\"><i class=\"material-icons\">stop</i></a></div></div><div class=\"row exercise-div center\"><h1 class=\"col l12 s12 \"><span class=\"exercise-name col s12\">Bench Press</span><div class=\"col s12 set-div\"><span class=\"exercise-set\">#1<sup>st</sup></span><spanclass=\"set-text\">Set</span></div></h1><h1 class=\"col l12 s12\">10 repetitions</h1><blockquote class=\"col l12 s12\">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod cum enim dolorem saepe porro iusto harumdeleniti debitis, nobis corrupti?</blockquote><a class=\"col l5 s5 btn btn-large waves-effect waves-light black \">Give Feedback</a><a class=\"col l5 s5 btn btn-large waves-effect waves-light black offset-l2 offset-s2\">Continue</a></div></div><script src=\"/js/chronometer.js\"></script><script src=\"https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js\"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.2/moment.min.js\"></script><!-- External libraries --><!-- jqvmap --><script type=\"text/javascript\" src=\"//cdn.shopify.com/s/files/1/1775/8583/t/1/assets/jquery.vmap.min.js?0\"></script><script type=\"text/javascript\" src=\"//cdn.shopify.com/s/files/1/1775/8583/t/1/assets/jquery.vmap.world.js?0\"charset=\"utf-8\"></script><script type=\"text/javascript\"src=\"//cdn.shopify.com/s/files/1/1775/8583/t/1/assets/jquery.vmap.sampledata.js?0\"></script><!-- ChartJS --><script type=\"text/javascript\" src=\"//cdn.shopify.com/s/files/1/1775/8583/t/1/assets/Chart.js?0\"></script><script type=\"text/javascript\" src=\"//cdn.shopify.com/s/files/1/1775/8583/t/1/assets/Chart.Financial.js?0\"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.7.0/fullcalendar.min.js\"></script><script type=\"text/javascript\" src=\"https://cdn.datatables.net/v/dt/dt-1.10.16/datatables.min.js\"></script><script src=\"//cdn.shopify.com/s/files/1/1775/8583/t/1/assets/imagesloaded.pkgd.min.js?0\"></script><script src=\"//cdn.shopify.com/s/files/1/1775/8583/t/1/assets/masonry.pkgd.min.js?0\"></script><!-- Initialization script --><script src=\"//cdn.shopify.com/s/files/1/1775/8583/t/1/assets/dashboard.min.js?0\"></script><div class=\"jqvmap-label\" style=\"display: none;\"></div><div class=\"sidenav-overlay\" style=\"display: none; opacity: 0;\"></div><div class=\"drag-target\"></div><div id=\"chartjs-tooltip\" class=\"bottom\" style=\"opacity: 0; left: 724px; top: 429px; padding: 12px;\"><table><thead><tr><th>two</th></tr></thead><tbody><tr><td>Number: 6</td></tr></tbody></table></div></body></html>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("partials\/footer",body_0);function body_0(chk,ctx){return chk.w("<footer class=\"footer\"><nav class=\"footer-nav\"><div class=\"row\"><div class=\"col-lg-4 col-xs-6\"><ul class=\"footer-menu\"><li><a class=\"footer-list-element\" href=\"#\">Home</a></li><li><a class=\"footer-list-element\" href=\"#\">Our Coaches</a></li><li><a class=\"footer-list-element\" href=\"#about\">About us</a></li><li><a class=\"footer-list-element\" href=\"#\">Sign up</a></li></ul></div><div class=\"col-lg-4 col-xs-6\"><ul class=\"legal-disclaimer\"><li><a class=\"footer-list-element\" href=\"#\">Cookies Policy</a></li><li><a class=\"footer-list-element\" href=\"#\">Privacy Policy</a></li><li><a class=\"footer-list-element\" href=\"#\">Moneyback Policy</a></li><li><a class=\"footer-list-element\" href=\"#about\">Support</a></li></ul></div><div class=\"col-lg-4 col-xs-12\"><img class=\"footer-logo\" src=\"img/logoPushAppWhite.svg\" alt=\"\"></div></div><div class=\"col-lg-4 col-xs-12\"></div></div></nav><span>Push App &copy; 2019</span><script src=\"/js/fetch.js\"></script></footer>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("partials\/header",body_0);function body_0(chk,ctx){return chk.w("    <header class=\"hero-header-banner-section\">").p("partials/nav",ctx,ctx,{}).w("<h1 class=\"header-text--h1 col-sm-12\">Push Your Limits</h1><span class=\"learn-more-text col-sm-12\">Create workouts, hire a coach <br> and track your progress in a single app</span><span class=\"learn-more-btn col-sm-12\"><a href=\"#about\">Learn More &#8605;</a></span></header>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("partials\/nations",body_0);function body_0(chk,ctx){return chk.w("<label for=\"country\">Country: </label> <span style=\"color: red !important; display: inline; float: none;\">*</span><select id=\"country\" name=\"country\" class=\"form-control\"><option value=\"Afghanistan\">Afghanistan</option><option value=\"Åland Islands\">Åland Islands</option><option value=\"Albania\">Albania</option><option value=\"Algeria\">Algeria</option><option value=\"American Samoa\">American Samoa</option><option value=\"Andorra\">Andorra</option><option value=\"Angola\">Angola</option><option value=\"Anguilla\">Anguilla</option><option value=\"Antarctica\">Antarctica</option><option value=\"Antigua and Barbuda\">Antigua and Barbuda</option><option value=\"Argentina\">Argentina</option><option value=\"Armenia\">Armenia</option><option value=\"Aruba\">Aruba</option><option value=\"Australia\">Australia</option><option value=\"Austria\">Austria</option><option value=\"Azerbaijan\">Azerbaijan</option><option value=\"Bahamas\">Bahamas</option><option value=\"Bahrain\">Bahrain</option><option value=\"Bangladesh\">Bangladesh</option><option value=\"Barbados\">Barbados</option><option value=\"Belarus\">Belarus</option><option value=\"Belgium\">Belgium</option><option value=\"Belize\">Belize</option><option value=\"Benin\">Benin</option><option value=\"Bermuda\">Bermuda</option><option value=\"Bhutan\">Bhutan</option><option value=\"Bolivia\">Bolivia</option><option value=\"Bosnia and Herzegovina\">Bosnia and Herzegovina</option><option value=\"Botswana\">Botswana</option><option value=\"Bouvet Island\">Bouvet Island</option><option value=\"Brazil\">Brazil</option><option value=\"British Indian Ocean Territory\">British Indian Ocean Territory</option><option value=\"Brunei Darussalam\">Brunei Darussalam</option><option value=\"Bulgaria\">Bulgaria</option><option value=\"Burkina Faso\">Burkina Faso</option><option value=\"Burundi\">Burundi</option><option value=\"Cambodia\">Cambodia</option><option value=\"Cameroon\">Cameroon</option><option value=\"Canada\">Canada</option><option value=\"Cape Verde\">Cape Verde</option><option value=\"Cayman Islands\">Cayman Islands</option><option value=\"Central African Republic\">Central African Republic</option><option value=\"Chad\">Chad</option><option value=\"Chile\">Chile</option><option value=\"China\">China</option><option value=\"Christmas Island\">Christmas Island</option><option value=\"Cocos (Keeling) Islands\">Cocos (Keeling) Islands</option><option value=\"Colombia\">Colombia</option><option value=\"Comoros\">Comoros</option><option value=\"Congo\">Congo</option><option value=\"Congo, The Democratic Republic of The\">Congo, The Democratic Republic of The</option><option value=\"Cook Islands\">Cook Islands</option><option value=\"Costa Rica\">Costa Rica</option><option value=\"Cote D'ivoire\">Cote D'ivoire</option><option value=\"Croatia\">Croatia</option><option value=\"Cuba\">Cuba</option><option value=\"Cyprus\">Cyprus</option><option value=\"Czech Republic\">Czech Republic</option><option value=\"Denmark\">Denmark</option><option value=\"Djibouti\">Djibouti</option><option value=\"Dominica\">Dominica</option><option value=\"Dominican Republic\">Dominican Republic</option><option value=\"Ecuador\">Ecuador</option><option value=\"Egypt\">Egypt</option><option value=\"El Salvador\">El Salvador</option><option value=\"Equatorial Guinea\">Equatorial Guinea</option><option value=\"Eritrea\">Eritrea</option><option value=\"Estonia\">Estonia</option><option value=\"Ethiopia\">Ethiopia</option><option value=\"Falkland Islands (Malvinas)\">Falkland Islands (Malvinas)</option><option value=\"Faroe Islands\">Faroe Islands</option><option value=\"Fiji\">Fiji</option><option value=\"Finland\">Finland</option><option value=\"France\">France</option><option value=\"French Guiana\">French Guiana</option><option value=\"French Polynesia\">French Polynesia</option><option value=\"French Southern Territories\">French Southern Territories</option><option value=\"Gabon\">Gabon</option><option value=\"Gambia\">Gambia</option><option value=\"Georgia\">Georgia</option><option value=\"Germany\">Germany</option><option value=\"Ghana\">Ghana</option><option value=\"Gibraltar\">Gibraltar</option><option value=\"Greece\">Greece</option><option value=\"Greenland\">Greenland</option><option value=\"Grenada\">Grenada</option><option value=\"Guadeloupe\">Guadeloupe</option><option value=\"Guam\">Guam</option><option value=\"Guatemala\">Guatemala</option><option value=\"Guernsey\">Guernsey</option><option value=\"Guinea\">Guinea</option><option value=\"Guinea-bissau\">Guinea-bissau</option><option value=\"Guyana\">Guyana</option><option value=\"Haiti\">Haiti</option><option value=\"Heard Island and Mcdonald Islands\">Heard Island and Mcdonald Islands</option><option value=\"Holy See (Vatican City State)\">Holy See (Vatican City State)</option><option value=\"Honduras\">Honduras</option><option value=\"Hong Kong\">Hong Kong</option><option value=\"Hungary\">Hungary</option><option value=\"Iceland\">Iceland</option><option value=\"India\">India</option><option value=\"Indonesia\">Indonesia</option><option value=\"Iran, Islamic Republic of\">Iran, Islamic Republic of</option><option value=\"Iraq\">Iraq</option><option value=\"Ireland\">Ireland</option><option value=\"Isle of Man\">Isle of Man</option><option value=\"Israel\">Israel</option><option value=\"Italy\">Italy</option><option value=\"Jamaica\">Jamaica</option><option value=\"Japan\">Japan</option><option value=\"Jersey\">Jersey</option><option value=\"Jordan\">Jordan</option><option value=\"Kazakhstan\">Kazakhstan</option><option value=\"Kenya\">Kenya</option><option value=\"Kiribati\">Kiribati</option><option value=\"Korea, Democratic People's Republic of\">Korea, Democratic People's Republic of</option><option value=\"Korea, Republic of\">Korea, Republic of</option><option value=\"Kuwait\">Kuwait</option><option value=\"Kyrgyzstan\">Kyrgyzstan</option><option value=\"Lao People's Democratic Republic\">Lao People's Democratic Republic</option><option value=\"Latvia\">Latvia</option><option value=\"Lebanon\">Lebanon</option><option value=\"Lesotho\">Lesotho</option><option value=\"Liberia\">Liberia</option><option value=\"Libyan Arab Jamahiriya\">Libyan Arab Jamahiriya</option><option value=\"Liechtenstein\">Liechtenstein</option><option value=\"Lithuania\">Lithuania</option><option value=\"Luxembourg\">Luxembourg</option><option value=\"Macao\">Macao</option><option value=\"Macedonia, The Former Yugoslav Republic of\">Macedonia, The Former Yugoslav Republic of</option><option value=\"Madagascar\">Madagascar</option><option value=\"Malawi\">Malawi</option><option value=\"Malaysia\">Malaysia</option><option value=\"Maldives\">Maldives</option><option value=\"Mali\">Mali</option><option value=\"Malta\">Malta</option><option value=\"Marshall Islands\">Marshall Islands</option><option value=\"Martinique\">Martinique</option><option value=\"Mauritania\">Mauritania</option><option value=\"Mauritius\">Mauritius</option><option value=\"Mayotte\">Mayotte</option><option value=\"Mexico\">Mexico</option><option value=\"Micronesia, Federated States of\">Micronesia, Federated States of</option><option value=\"Moldova, Republic of\">Moldova, Republic of</option><option value=\"Monaco\">Monaco</option><option value=\"Mongolia\">Mongolia</option><option value=\"Montenegro\">Montenegro</option><option value=\"Montserrat\">Montserrat</option><option value=\"Morocco\">Morocco</option><option value=\"Mozambique\">Mozambique</option><option value=\"Myanmar\">Myanmar</option><option value=\"Namibia\">Namibia</option><option value=\"Nauru\">Nauru</option><option value=\"Nepal\">Nepal</option><option value=\"Netherlands\">Netherlands</option><option value=\"Netherlands Antilles\">Netherlands Antilles</option><option value=\"New Caledonia\">New Caledonia</option><option value=\"New Zealand\">New Zealand</option><option value=\"Nicaragua\">Nicaragua</option><option value=\"Niger\">Niger</option><option value=\"Nigeria\">Nigeria</option><option value=\"Niue\">Niue</option><option value=\"Norfolk Island\">Norfolk Island</option><option value=\"Northern Mariana Islands\">Northern Mariana Islands</option><option value=\"Norway\">Norway</option><option value=\"Oman\">Oman</option><option value=\"Pakistan\">Pakistan</option><option value=\"Palau\">Palau</option><option value=\"Palestinian Territory, Occupied\">Palestinian Territory, Occupied</option><option value=\"Panama\">Panama</option><option value=\"Papua New Guinea\">Papua New Guinea</option><option value=\"Paraguay\">Paraguay</option><option value=\"Peru\">Peru</option><option value=\"Philippines\">Philippines</option><option value=\"Pitcairn\">Pitcairn</option><option value=\"Poland\">Poland</option><option value=\"Portugal\">Portugal</option><option value=\"Puerto Rico\">Puerto Rico</option><option value=\"Qatar\">Qatar</option><option value=\"Reunion\">Reunion</option><option value=\"Romania\">Romania</option><option value=\"Russian Federation\">Russian Federation</option><option value=\"Rwanda\">Rwanda</option><option value=\"Saint Helena\">Saint Helena</option><option value=\"Saint Kitts and Nevis\">Saint Kitts and Nevis</option><option value=\"Saint Lucia\">Saint Lucia</option><option value=\"Saint Pierre and Miquelon\">Saint Pierre and Miquelon</option><option value=\"Saint Vincent and The Grenadines\">Saint Vincent and The Grenadines</option><option value=\"Samoa\">Samoa</option><option value=\"San Marino\">San Marino</option><option value=\"Sao Tome and Principe\">Sao Tome and Principe</option><option value=\"Saudi Arabia\">Saudi Arabia</option><option value=\"Senegal\">Senegal</option><option value=\"Serbia\">Serbia</option><option value=\"Seychelles\">Seychelles</option><option value=\"Sierra Leone\">Sierra Leone</option><option value=\"Singapore\">Singapore</option><option value=\"Slovakia\">Slovakia</option><option value=\"Slovenia\">Slovenia</option><option value=\"Solomon Islands\">Solomon Islands</option><option value=\"Somalia\">Somalia</option><option value=\"South Africa\">South Africa</option><option value=\"South Georgia and The South Sandwich Islands\">South Georgia and The South Sandwich Islands</option><option value=\"Spain\">Spain</option><option value=\"Sri Lanka\">Sri Lanka</option><option value=\"Sudan\">Sudan</option><option value=\"Suriname\">Suriname</option><option value=\"Svalbard and Jan Mayen\">Svalbard and Jan Mayen</option><option value=\"Swaziland\">Swaziland</option><option value=\"Sweden\">Sweden</option><option value=\"Switzerland\">Switzerland</option><option value=\"Syrian Arab Republic\">Syrian Arab Republic</option><option value=\"Taiwan, Province of China\">Taiwan, Province of China</option><option value=\"Tajikistan\">Tajikistan</option><option value=\"Tanzania, United Republic of\">Tanzania, United Republic of</option><option value=\"Thailand\">Thailand</option><option value=\"Timor-leste\">Timor-leste</option><option value=\"Togo\">Togo</option><option value=\"Tokelau\">Tokelau</option><option value=\"Tonga\">Tonga</option><option value=\"Trinidad and Tobago\">Trinidad and Tobago</option><option value=\"Tunisia\">Tunisia</option><option value=\"Turkey\">Turkey</option><option value=\"Turkmenistan\">Turkmenistan</option><option value=\"Turks and Caicos Islands\">Turks and Caicos Islands</option><option value=\"Tuvalu\">Tuvalu</option><option value=\"Uganda\">Uganda</option><option value=\"Ukraine\">Ukraine</option><option value=\"United Arab Emirates\">United Arab Emirates</option><option value=\"United Kingdom\">United Kingdom</option><option value=\"United States\">United States</option><option value=\"United States Minor Outlying Islands\">United States Minor Outlying Islands</option><option value=\"Uruguay\">Uruguay</option><option value=\"Uzbekistan\">Uzbekistan</option><option value=\"Vanuatu\">Vanuatu</option><option value=\"Venezuela\">Venezuela</option><option value=\"Viet Nam\">Viet Nam</option><option value=\"Virgin Islands, British\">Virgin Islands, British</option><option value=\"Virgin Islands, U.S.\">Virgin Islands, U.S.</option><option value=\"Wallis and Futuna\">Wallis and Futuna</option><option value=\"Western Sahara\">Western Sahara</option><option value=\"Yemen\">Yemen</option><option value=\"Zambia\">Zambia</option><option value=\"Zimbabwe\">Zimbabwe</option></select>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("partials\/nav",body_0);function body_0(chk,ctx){return chk.w("<nav role=\"navigation\"><div id=\"menuToggle\"><input type=\"checkbox\" /><span></span><span></span><span></span><ul id=\"menu\"><a href=\"#\"><li>Home</li></a><a href=\"#\"><li>Our Coaches</li></a><a href=\"#\"><li>About us</li></a><a href=\"/login\"><li>Login</li></a><a href=\"/register\" target=\"_blank\"><li>Sign up now!</li></a></ul></div></nav><nav class=\"nav\"><img src=\"img/logoPushAppWhite.svg\" alt=\"\"><ul><li><a class=\"list-element\" href=\"#\">Home</a></li><li><a class=\"list-element\" href=\"#\">Our Coaches</a></li><li><a class=\"list-element\" href=\"#about\">About us</a></li><li><a class=\"list-element\" href=\"/login\">Login</a></li><li><a class=\"btn btn--gradient\" href=\"/register\">Sign up now!</a></li></ul></nav>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("partials\/register",body_0);function body_0(chk,ctx){return chk.w("<div><label>First name:<input required pattern=\"[a-zA-Z][a-z]+$\" type=\"text\" value=\"").f(ctx.get(["firstName"], false),ctx,"h").w("\" name=\"firstName\"/></label></div><div><label>Last name:<input required pattern=\"[a-zA-Z][a-z]+$\" type=\"text\" value=\"").f(ctx.get(["lastName"], false),ctx,"h").w("\" name=\"lastName\"/></label></div><div><label>Description:").x(ctx.get(["description"], false),ctx,{"else":body_1,"block":body_2},{}).w("</label></div><div><label>Choose yor photo:<input accept=\"image/*\" type=\"file\" name=\"image\"/></label></div><div><label>Birthday:<input required value=\"").f(ctx.get(["bday"], false),ctx,"h").w("\" min=\"1900-01-01\" max=\"").f(ctx.get(["maxDate"], false),ctx,"h").w("\" type=\"date\" name=\"birthday\"/></label></div><div><label>Sex:<br><input type=\"radio\" name=\"sex\" value=\"male\" required> Male<br><input type=\"radio\" name=\"sex\" value=\"female\"> Female<br><input type=\"radio\" name=\"sex\" value=\"other\"> Other</label></div><div><label>unit system:<br><input type=\"radio\" name=\"unitSystem\" value=\"metric\"> Metric<br><input type=\"radio\" name=\"unitSystem\" value=\"other\"> other<br><input type=\"radio\" name=\"unitSystem\" value=\"other\"> Other</label></div><div><label>Phone:<input required value=\"").f(ctx.get(["phone"], false),ctx,"h").w("\" type=\"text\" name=\"phone\"/></label></div><div><label>address1:<input required value=\"").f(ctx.get(["address1"], false),ctx,"h").w("\" type=\"text\" name=\"address1\"/></label></div><div><label>address2:<input type=\"text\" value=\"").f(ctx.get(["address2"], false),ctx,"h").w("\" name=\"address2\"/></label></div><div><label>city:<input required value=\"").f(ctx.get(["city"], false),ctx,"h").w("\" type=\"text\" name=\"city\"/></label></div><div><label>state:<input required value=\"").f(ctx.get(["state"], false),ctx,"h").w("\"type=\"text\" name=\"state\"/></label></div><div><label>zip Code:<input required value=\"").f(ctx.get(["zipCode"], false),ctx,"h").w("\" type=\"text\" name=\"zipCode\"/></label></div><div><label>Country:<input required value=\"").f(ctx.get(["country"], false),ctx,"h").w("\" type=\"text\" name=\"country\"/></label></div><div><label>Currency:<select required id=\"currency\" name=\"currency\"><option value=\"Euro\">€</option><option value=\"CHF\">CHF</option><option value=\"USD\">$</option><option value=\"AUS\">AU$</option><option value=\"CAN\">$CAN</option><option value=\"Yen\">¥</option><option value=\"GBP\">£</option><option value=\"SWE\">kr</option></select></label></div><div><label>Localization: <input onload=\"getLocation()\" name=\"localization\"/></label></div><div><label>Email:<input required value=\"").f(ctx.get(["email"], false),ctx,"h").w("\" type=\"email\" name=\"email\"/></label></div>");}body_0.__dustBody=!0;function body_1(chk,ctx){return chk.w("<input type=\"text\" name=\"description\"/>");}body_1.__dustBody=!0;function body_2(chk,ctx){return chk.w("<input type=\"text\" value=\"").f(ctx.get(["description"], false),ctx,"h").w("\" name=\"description\"/>");}body_2.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("register_forms\/client-register",body_0);function body_0(chk,ctx){return chk.w("<!DOCTYPE html><html><head><title>Client register</title></head><body onload=\"findName()\"><h2>Register new Client</h2><form onsubmit=\"return mySubmit();\" action=\"/clients/new\"  method=\"post\" enctype=\"application/x-www-form-urlencoded\">").p("../partials/register",ctx,ctx,{}).w("<div><label>bmi:").x(ctx.get(["bmi"], false),ctx,{"else":body_1,"block":body_2},{}).w("</label></div><div><label>height (in cm):").x(ctx.get(["height"], false),ctx,{"else":body_3,"block":body_4},{}).w("</label></div><div><label>weight (in kg):").x(ctx.get(["weight"], false),ctx,{"else":body_5,"block":body_6},{}).w("</label></div><div><label>Username:<input required id=\"user\" value=\"\" type=\"text\" name=\"username\"/></label></div><div><label>Password:<input required type=\"password\"title=\"The password should contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters\"name=\"password\"/></label></div><div><input type=\"submit\" value=\"Register\"/></div></form><script src=\"/js/helper.js\"></script><script src=\"js/resources/dustjs-linkedin/dust-core.min.js\"></script><script src=\"/js/views.js\"></script></body></html>");}body_0.__dustBody=!0;function body_1(chk,ctx){return chk.w("<input type=\"text\" name=\"bmi\"/>");}body_1.__dustBody=!0;function body_2(chk,ctx){return chk.w("<input value=\"").f(ctx.get(["bmi"], false),ctx,"h").w("\" type=\"text\" name=\"bmi\"/>");}body_2.__dustBody=!0;function body_3(chk,ctx){return chk.w("<input pattern=\"[0-2][0-9]{2}\" type=\"text\" name=\"height\"/>");}body_3.__dustBody=!0;function body_4(chk,ctx){return chk.w("<input pattern=\"[0-2][0-9]{2}\" value=\"").f(ctx.get(["height"], false),ctx,"h").w("\" type=\"text\" name=\"height\"/>");}body_4.__dustBody=!0;function body_5(chk,ctx){return chk.w(" <input pattern=\"[0-9]{3}\" type=\"text\" name=\"weight\"/>");}body_5.__dustBody=!0;function body_6(chk,ctx){return chk.w("<input pattern=\"[0-9]{3}\" value=\"").f(ctx.get(["weight"], false),ctx,"h").w("\" type=\"text\" name=\"weight\"/>");}body_6.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("register_forms\/coach-register",body_0);function body_0(chk,ctx){return chk.w("<!DOCTYPE html><html><head><title>Coach register</title></head><body onload=\"findName()\"><h2>Register new Coach</h2><form onsubmit=\"return mySubmit()\" method=\"post\" action=\"/coaches/new\" enctype=\"application/x-www-form-urlencoded\">").p("../partials/register",ctx,ctx,{}).w("<label for=\"username\">Username:<input required id=\"user\" name=\"username\" type=\"text\" placeholder=\"username\"/></label><label for=\"password\">Password:<input required name=\"password\" type=\"password\" placeholder=\"pw\"/></label><input type=\"submit\" value=\"Create Account\"/></form><script src=\"/js/helper.js\"></script><script src=\"js/resources/dustjs-linkedin/dust-core.min.js\"></script><script src=\"/js/views.js\"></script></body></html>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("register_forms\/register_1",body_0);function body_0(chk,ctx){return chk.w("<!DOCTYPE html><html><head><title>register</title></head><body><div id=\"reg\"><button onclick=\"testing()\" name=\"coach\">1. Coach</button><button onclick=\"fetchClient(event)\" name=\"client\">2. Client</button></div><script src=\"/js/resources/dustjs-linkedin/dust-core.min.js\"></script><script src=\"/js/views.js\"></script><script src=\"/js/helper.js\"></script></body></html>");}body_0.__dustBody=!0;return body_0}(dust));
