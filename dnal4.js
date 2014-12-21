
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";

function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}






$(document).ready(function(){
	console.log("pagestarted");
    
    start();
	ponastaviStart();
	$('#izberiOsebo').change(function(){

		
		var tabela1 = $(this).val().split(",");
		$("#vnesiPriimek").val(tabela1[0]);
		$("#vnesiIme").val(tabela1[1]);
		$("#vnesiDatum").val(tabela1[2]);
		$("#chkBox1").prop('checked', true);


		

	});


	$('#izberiOsebo2').change(function(){
		var tabela2= $(this).val();
		$("#EHRIDposameznika1").val(tabela2);
	});
	$('#izberiOsebo3').change(function(){
		var tabela3= $(this).val().split(",");
		$("#EHRIDposameznika2").val(tabela3[0]);
		$("#vpisiTVisina").val(tabela3[1]);
		$("#vpisiTTeza").val(tabela3[2]);
		$("#vpisiTemperaturo").val(tabela3[3]);
		$("#vpisiSistolicniKT").val(tabela3[4]);
		$("#vpisiDiastolicniKT").val(tabela3[5]);
		$("#vpisiSrcniU").val(tabela3[6]);
		$("#vpisiNasicenost").val(tabela3[7]);
		$("#datumInU").val(tabela3[8]);
		$("#merilec").val(tabela3[9]);


	});

	$('#izberiOsebo4').change(function(){
		var tabela4= $(this).val();
		$("#EHRIDposameznika3").val(tabela4);
            $("#EHRIDposameznika3").val(tabela4);
        $("#rezultatNapoved2").html("");
        $("#napovedSporocilo2").html("");
        $("#napovedSporocilo3").html("");
        $("#rezultatNapoved3").html("");
        $("#prehranaTekst").html("");
        $("#prehranaLinki").html("");
        $("#rezultatNapoved3").html("");
         $("#treningTekst").html("");
          $("#prehranaLinki2").html("");
           $("#lenarjenjeTekst").html("");
           ponastaviStart();
	});
});



function ustvariEHR() {
	sessionId = getSessionId();

	
	var priimek = $("#vnesiPriimek").val();
	var ime = $("#vnesiIme").val();
	var datum= $("#vnesiDatum").val();
	if ($('#chkBox1').is(":checked")){
		var spol = "MALE";
		//console.log("he");
	}
	if ($('#chkBox2').is(":checked")){
		var spol = "FEMALE";
	}
 
 if( !priimek || !ime ||!datum || !spol || priimek.trim().length ==0 || ime.trim().length ==0 || datum.trim().length ==0){
 	$("#EHRSporocilo").html("<p class='label label-danger '> Napacno vneseni podatki!</p>");
 }
 else {
 	$.ajaxSetup({
 		headers: {"Ehr-Session": sessionId}

 	});
 	$.ajax({
 		url: baseUrl + "/ehr",
 		type: 'POST',
 		success: function (podatki1){
 			var ehrId= podatki1.ehrId;
 			napredek25();
 			//console.log(podatki1.meta.href);
 			var vsiOSP= {
 				firstNames: ime,
		        lastNames: priimek,
		        dateOfBirth: datum,
		        gender: spol,
 				partyAdditionalInfo: [{key: "ehrId", value: ehrId}]

 			};
 			$("#EHRIDposameznika1").val(ehrId);

 		
 		$.ajax({
 			url: baseUrl + "/demographics/party",
 			type: 'POST',
 			contentType: 'application/json',
 			data: JSON.stringify(vsiOSP),
 			success: function(podatki2){
 			if(podatki2.action == 'CREATE'){
 				$("#EHRSporocilo").html("<p class='text-center'>"+ehrId+"</p>");
 				  console.log(" EHR ID:'" + ehrId + "' :)");
		                    
			}
		},
		error: function(err){
			$("#EHRSporocilo").html("<p class='label label-warning'>Prislo je do napake:</p>"+ JSON.parse(err.responseText).userMessage );
			console.log(JSON.parse(err.responseText).userMessage);
				}
 				});
 			}
 		});

 	}
 }

function vnesiMVZ(){
	sessionId=getSessionId();

	var ehrId= $("#EHRIDposameznika2").val();
	var tVisina= $("#vpisiTVisina").val();
	var tTeza = $("#vpisiTTeza").val();
	var tTemperatura = $("#vpisiTemperaturo").val();
	var sistolicniKT= $("#vpisiSistolicniKT").val();
	var diastolicniKT = $("#vpisiDiastolicniKT").val();
	var srcniU = $("#vpisiSrcniU").val();
	var nasicenostKisik = $("#vpisiNasicenost").val();
	var datumInU = $("#datumInU").val();
	var merilec = $("#merilec").val();
	var itm = tTeza/((tVisina/100)*(tVisina/100));
	

	if(!ehrId || ehrId.trim().length == 0){//lahko vneses za vse podatke kasneje!
		$("#vneseneMVZ").html("<p class='label label-danger '> Prosimo vpisite EHR ID in ostale potrebne podatke!</p>");
	}
	else {

		$.ajaxSetup({
			headers: {"Ehr-Session": sessionId}
		});
		
		var mvz= {
			"ctx/language": "en",
			"ctx/territory": "SI",
			"ctx/time": datumInU,
			"vital_signs/height_length/any_event/body_height_length": tVisina,
			"vital_signs/body_weight/any_event/body_weight": tTeza,
			"vital_signs/body_temperature/any_event/temperature|magnitude": tTemperatura,
    		"vital_signs/body_temperature/any_event/temperature|unit": "°C",
			"vital_signs/blood_pressure/any_event/systolic|magnitude": sistolicniKT,
			"vital_signs/blood_pressure/any_event/systolic|unit":"mm[Hg]",
			"vital_signs/blood_pressure/any_event/diastolic|magnitude": diastolicniKT,
			"vital_signs/blood_pressure/any_event/diastolic|unit":"mm[Hg]",
			"vital_signs/indirect_oximetry/spo2|numerator": nasicenostKisik,
			"vital_signs/pulse:0/any_event:0/rate|magnitude": srcniU,
			"vital_signs/pulse:0/any_event:0/rate|unit":"/min",
			"vital_signs/body_mass_index/any_event/body_mass_index|magnitude": itm,
			"vital_signs/body_mass_index/any_event/body_mass_index|unit": "kg/m2"
		};
		
		var parametri1 = {
			"ehrId": ehrId,
			templateId: 'Vital Signs',
			format: 'FLAT',
			committer: merilec
		};
		$.ajax({
			url: baseUrl+ "/composition?" + $.param(parametri1),
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(mvz),
			success: function (podatki4){
				napredek75();
				
				
				$("#vneseneMVZ").html("<span class='glyphicon glyphicon-ok'> Vneseno </span>");
			},
			error: function(err){
				$("#vneseneMVZ").html("<p class='label label-warning'>Prislo je do napake:</p>"+ JSON.parse(err.responseText).userMessage );
				console.log(JSON.parse(err.responseText).userMessage);
			}

		});
	}
}


function vrniOSP(){
	sessionId=getSessionId();

	var ehrId= $("#EHRIDposameznika1").val();

	if(!ehrId || ehrId.trim().length == 0){
		$("#OSPposameznika").html("<p class='label label-danger '> Prosimo vnesite veljaven Ehr ID</p>");
	}
	else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/"+ ehrId+"/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
			success: function(podatki3){
				napredek50();
				var party= podatki3.party;
				if(party.gender =='FEMALE'){
					var spol2="Z"
				}
				if(party.gender =='MALE') {
					var spol2="M"
				}
				$("#OSPposameznika").html("<p>" +party.firstNames+" "+party.lastNames+" rojen "+party.dateOfBirth+" spol: "+spol2 +"</p>");
			},
			error: function(err){
				$("#OSPposameznika").html("<p class='label label-warning '> Prislo je do napake:</p>"+ JSON.parse(err.responseText).userMessage);
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});
	}

}

function vrniNapoved() {
	sessionId= getSessionId();

	var ehrId=$("#EHRIDposameznika3").val();

	if(!ehrId || ehrId.trim().length==0 ){
		
		$("#napovedSporocilo").html("<p class='label label-danger '> Prosimo vnesite veljaven Ehr ID</p>");
	}
	else {	
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (podatki6) {
				var party = podatki6.party;
				$("#napovedSporocilo2").html("<span class= 'glyphicon glyphicon-hand-down'>  </span><span class= 'glyphicon glyphicon-hand-down'></span><span class= 'glyphicon glyphicon-hand-down'></span>");
				$("#napovedSporocilo3").html("<p>Pregled meritev za osebo: <font size ='3' color='#0066FF'>" + party.lastNames + " " + party.firstNames + "</font></p>");
				
		
	var AQLsrce = 
			"select "+
			"z/data[at0002]/events[at0003]/time/value as datum, "+
    "z/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as srcniUtrip, "+
    "z/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/units as utripovNaMin "+
    "from EHR e[e/ehr_id/value='"+ ehrId +"'] " +
    "contains OBSERVATION z[openEHR-EHR-OBSERVATION.heart_rate-pulse.v1] "+
    "where z/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude<60 "+
    "OR z/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude>100 " +
    "order by z/data[at0002]/events[at0003]/time/value desc " + 
    "limit 5 ";
    $.ajax({
    	url: baseUrl + "/query?"+$.param({"aql": AQLsrce}),
    	type: 'GET',
    	headers: {"Ehr-Session": sessionId},

    	success: function(podatki5){
    		napredek100();
            
    		
    	if (podatki5){
            obisciZdravnika();
            var tabelaPodatkov="<p align='center'><font color='#C00000'>ZASKRBLJUJOČE VREDNOSTI!</font></p><p align='center'>Prosimo obiščite svojega zdravnika!</p><br> <table class='table table-condensed'> <tr><th>Datum in ura</th><th>Srcni utrip</th></tr>";
    		var vrstice = podatki5.resultSet;
    		for (var i in vrstice){
    			tabelaPodatkov+="<tr><td>"+vrstice[i].datum + "</td><td>"+ vrstice[i].srcniUtrip +" "+vrstice[i].utripovNaMin + "</td>";
    		}
    		tabelaPodatkov+="</table>";
    		$("#rezultatNapoved2").append(tabelaPodatkov);
    	}
    	else {//zacetek 2aql
    		var AQLtlak =
    		"select "+
    		"x/data[at0001]/events[at0006]/time/value as datum, " +
			"x/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value/magnitude as sistolicni, " +
			"x/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value/units as hhmg " +
    "from EHR e[e/ehr_id/value='"+ ehrId +"'] " +
    "contains OBSERVATION x[openEHR-EHR-OBSERVATION.blood_pressure.v1] " +
    "where x/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value/magnitude >140 " +
    "order by x/data[at0001]/events[at0006]/time/value desc " +
	"limit 5";
	
    		
    		$.ajax({
    			url: baseUrl + "/query?"+$.param({"aql": AQLtlak}),
    	type: 'GET',
    	headers: {"Ehr-Session": sessionId},

    	success: function(podatki7){


    		
    		
    	
    	if (podatki7){
            
            obisciZdravnika();
            var tabelaPodatkov2="<p align='center'><font color='#C00000'>ZASKRBLJUJOČE VREDNOSTI!</font></p><p align='center'>Prosimo obiščite svojega zdravnika!</p><br><table class='table table-condensed'> <tr><th>Datum in ura</th><th>Sistolični krvni tlak</th></tr>";
    		var vrstice2 = podatki7.resultSet;
    		for (var j in vrstice2){
    			console.log(vrstice2[j].sistolicni);
    			tabelaPodatkov2+="<tr><td>"+vrstice2[j].datum + "</td><td>"+ vrstice2[j].sistolicni + " "+vrstice2[j].hhmg+"</td>";
    		}
    		tabelaPodatkov2+="</table>";
    		$("#rezultatNapoved2").append(tabelaPodatkov2);
    	}
    	else {//3 aql
    		
    		var AQLtlak2 =
    		"select "+
    		"y/data[at0001]/events[at0006]/time/value as datum, " +
			"y/data[at0001]/events[at0006]/data[at0003]/items[at0005]/value/magnitude as diastolicni, " +
			"y/data[at0001]/events[at0006]/data[at0003]/items[at0005]/value/units as hhmg2 " +
    "from EHR e[e/ehr_id/value='"+ ehrId +"'] " +
    "contains OBSERVATION y[openEHR-EHR-OBSERVATION.blood_pressure.v1] " +
    "where y/data[at0001]/events[at0006]/data[at0003]/items[at0005]/value/magnitude >90 " +
    "order by y/data[at0001]/events[at0006]/time/value desc " +
	"limit 5";
	
    		
    		$.ajax({
    			url: baseUrl + "/query?"+$.param({"aql": AQLtlak2}),
    	type: 'GET',
    	headers: {"Ehr-Session": sessionId},

    	success: function(podatki8){
    		
    		
    	
    	if (podatki8){
            obisciZdravnika();
            var tabelaPodatkov3="<p align='center'><font color='#C00000'>ZASKRBLJUJOČE VREDNOSTI!</font></p><p align='center'>Prosimo obiščite svojega zdravnika!</p><br><table class='table table-condensed'> <tr><th>Datum in ura</th><th>Diastolični krvni tlak</th></tr>";
    		

    		var vrstice3 = podatki8.resultSet;
    		for (var j in vrstice3){
    			
    			tabelaPodatkov3+="<tr><td>"+vrstice3[j].datum + "</td><td>"+ vrstice3[j].diastolicni + " "+vrstice3[j].hhmg2+"</td>";
    		}
    		tabelaPodatkov3+="</table>";
    		$("#rezultatNapoved2").append(tabelaPodatkov3);
    	}
    	else {//4 aql  
    		
    		var AQLtemp =
    		"select " +
    		"v/data[at0002]/events[at0003]/time/value as datum, " +
    		"v/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as ttemperatura, " +
    		"v/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/units as c " +
			"from EHR e[e/ehr_id/value='" + ehrId + "'] " +
			"contains OBSERVATION v[openEHR-EHR-OBSERVATION.body_temperature.v1] " +
			"where v/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude<35 " +
			"OR v/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude>38 "
			"order by v/data[at0002]/events[at0003]/time/value desc " +
			"limit 5";
	
    		
    		$.ajax({
    			url: baseUrl + "/query?"+$.param({"aql": AQLtemp}),
    	type: 'GET',
    	headers: {"Ehr-Session": sessionId},

    	success: function(podatki9){
    		napredek100();
    		
    	
    	if (podatki9){
            var tabelaPodatkov4="<p align='center'><font color='#C00000'>ZASKRBLJUJOČE VREDNOSTI!</font></p><p align='center'>Prosimo obiščite svojega zdravnika!</p><br><table class='table table-condensed'> <tr><th>Datum in ura</th><th>Telesna temperatura</th></tr>";
            obisciZdravnika();
    		

    		var vrstice4 = podatki9.resultSet;
    		for (var j in vrstice4){
    			
    			tabelaPodatkov4+="<tr><td>"+vrstice4[j].datum + "</td><td>"+ vrstice4[j].ttemperatura + " "+vrstice4[j].c+"</td>";
    		}
    		tabelaPodatkov4+="</table>";
    		$("#rezultatNapoved2").append(tabelaPodatkov4);
    	}
    	else { //5aql najpomembnejsi hehehehehehehe
    		var AQLkisik =
    		"select " +
    		"o/data[at0001]/events[at0002]/time/value as datum, " +
    		"o/data[at0001]/events[at0002]/data[at0003]/items[at0006]/value/numerator as spO2 " +
    		"from EHR e[e/ehr_id/value='" + ehrId + "'] " +
			"contains OBSERVATION o[openEHR-EHR-OBSERVATION.indirect_oximetry.v1] " +
			"where o/data[at0001]/events[at0002]/data[at0003]/items[at0006]/value/numerator<85 " +
			"order by o/data[at0001]/events[at0002]/time/value desc " +
			"limit 5";
	
    		
    		$.ajax({
    			url: baseUrl + "/query?"+$.param({"aql": AQLkisik}),
    	type: 'GET',
    	headers: {"Ehr-Session": sessionId},

    	success: function(podatki10){
    		
    		
    	
    	if (podatki10){
            obisciZdravnika();
            var tabelaPodatkov5="<p align='center'><font color='#C00000'>ZASKRBLJUJOČE VREDNOSTI!</font></p><p align='center'>Prosimo obiščite svojega zdravnika!</p><br><table class='table table-condensed'> <tr><th>Datum in ura</th><th>Nasičenost s kisikom</th></tr>";
    		

    		var vrstice5 = podatki10.resultSet;
    		for (var j in vrstice5){
    			
    			tabelaPodatkov5+="<tr><td>"+vrstice5[j].datum + "</td><td>"+ vrstice5[j].spO2 + " %</td>";
    		}
    		tabelaPodatkov5+="</table>";
    		$("#rezultatNapoved2").append(tabelaPodatkov5);
    	}
    		else {//6aql
    				var AQLbmi =
    		"select "+
    		"k/data[at0001]/events[at0002]/time/value as datum1, " +
			"k/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/magnitude as bmi, " +
			"k/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/units as kgm2 " +
    		"from EHR e[e/ehr_id/value='"+ ehrId +"'] " +
    		"contains OBSERVATION k[openEHR-EHR-OBSERVATION.body_mass_index.v1] " +
    		"where k/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/magnitude>30 " +
    		"OR k/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/magnitude<18.5"
    		"order by k/data[at0001]/events[at0002]/time/value desc " +
			"limit 1";
	
    		
    		$.ajax({
    			url: baseUrl + "/query?"+$.param({"aql": AQLbmi}),
    	type: 'GET',
    	headers: {"Ehr-Session": sessionId},

    success: function(podatki11){
    		
    		
    	
    	if (podatki11){
    		

    		var vrstice6 = podatki11.resultSet;
    		for (var j in vrstice6){
    			console.log(vrstice6[j].bmi);

    			
    			var podatkov6 = "<p>  Indeks telesne mase: <font color='red' size='3'>"+ vrstice6[j].bmi.toFixed(2) + "</font> <br> Na dan " + vrstice6[j].datum1 + "</p>";
    		}
    		
    		$("#rezultatNapoved2").append(podatkov6);
            nezdravBmi();

            if (vrstice6[j].bmi>30){// funkcije za itm30+
              // debelost stopnje 1
              var prehranaDebeli = "<p> Prosimo <font color='#3300FF'>zmanjšajte dnevni vnos kalorij</font>, saj resno ogrožate vaše zdravje</p><p onclick='vec()'><u>Več>></u></p>";
              var treningDebeli= "<p> Vaš trening naj vsebuje predvsem zmerno kardio vadbo najmanj 30min, 3-4x tedensko!</p><p onclick='vec2()'><u>Več>></u></p>";

              if (vrstice6[j].bmi>35){//debelost stopnje 2
                
                if (vrstice6[j].bmi>40){ //debelost stopnje 3
                    obisciZdravnika();
                    var bmi40= "<p>  Indeks telesne mase: <font color='red' size='3'>"+ vrstice6[j].bmi.toFixed(2) + "</font> nakazuje na debelost 3. stopnje!</p>";
                    $("#rezultatNapoved3").append(bmi40);
                    $("#prehranaTekst").append(prehranaDebeli);
                    $("#treningTekst").append(treningDebeli);
                    }
                    else {//debelost stopnje 2
                        nevarnost88();
                        var bmi35= "<p>  Indeks telesne mase: <font color='red' size='3'>"+ vrstice6[j].bmi.toFixed(2) + "</font> nakazuje na debelost 2. stopnje!</p>";
                        $("#rezultatNapoved3").append(bmi35);
                    $("#prehranaTekst").append(prehranaDebeli);
                    $("#treningTekst").append(treningDebeli);

                    }


                }
                else {// debelost stopnje 1
                    nevarnost44();
                    var bmi30= "<p>  Indeks telesne mase: <font color='red' size='3'>"+ vrstice6[j].bmi.toFixed(2) + "</font> nakazuje na debelost 1. stopnje!</p>";
                        $("#rezultatNapoved3").append(bmi30);
                    $("#prehranaTekst").append(prehranaDebeli);
                    $("#treningTekst").append(treningDebeli);


                }
            }

            if (vrstice6[j].bmi<18.5){
            // funkcije za itm18-
                var prehranaDebeli = "<p> Prosimo <font color='#3300FF'>povečajte dnevni vnos kalorij</font>, saj resno ogrožate vaše zdravje. </p><p onclick='vec()'><u>Več>></u></p>";
              var treningDebeli= "<p> Vaš trening naj vsebuje predvsem vadbo osredotočeno na pridobivanje mišične mase. Priporočamo vadbo z utežmi 3-4x tedensko.</p><p onclick='vec2()'><u>Več>></u></p>";
                    if (vrstice6[j].bmi<17){
                        if (vrstice6[j].bmi<16){//huda nedohranjenost
                            obisciZdravnika();
                            var bmi16 ="<p>  Indeks telesne mase: <font color='red' size='3'>"+ vrstice6[j].bmi.toFixed(2) + "</font> nakazuje na hudo nedohranjenost!</p>";
                                 $("#rezultatNapoved3").append(bmi16);
                    $("#prehranaTekst").append(prehranaDebeli);
                    $("#treningTekst").append(treningDebeli);
                        }
                        else {// zmerna nedohranjenost
                            nevarnost88();
                              var bmi17 ="<p>  Indeks telesne mase: <font color='red' size='3'>"+ vrstice6[j].bmi.toFixed(2) + "</font> nakazuje na zmerno nedohranjenost!</p>";
                                 $("#rezultatNapoved3").append(bmi17);
                    $("#prehranaTekst").append(prehranaDebeli);
                    $("#treningTekst").append(treningDebeli);
                        }

                        

                    }
                    else {// blaga nedohranjenost
                         nevarnost44();
                         var bmi18 ="<p>  Indeks telesne mase: <font color='red' size='3'>"+ vrstice6[j].bmi.toFixed(2) + "</font> nakazuje na blago nedohranjenost!</p>";
                                 $("#rezultatNapoved3").append(bmi18);
                    $("#prehranaTekst").append(prehranaDebeli);
                    $("#treningTekst").append(treningDebeli);

                    }
    	   }
        }
    	else {
    		
            var AQLbmi2 =
            "select "+
            "u/data[at0001]/events[at0002]/time/value as datum2, " +
            "u/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/magnitude as zdravbmi, " +
            "u/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/units as kgm22 " +
            "from EHR e[e/ehr_id/value='"+ ehrId +"'] " +
            "contains OBSERVATION u[openEHR-EHR-OBSERVATION.body_mass_index.v1] " +
            "where u/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/magnitude<=30 " +
            "OR u/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/magnitude>=18.5"
            "order by u/data[at0001]/events[at0002]/time/value desc " +
            "limit 1";


            $.ajax({
                url: baseUrl + "/query?"+$.param({"aql": AQLbmi2}),
        type: 'GET',
        headers: {"Ehr-Session": sessionId},
         success: function(podatki12){
            zdravBmi();
            
            var vrstice7 = podatki12.resultSet;
            for (var j in vrstice7){
                

                
                var podatkov7 = "<p>  Indeks telesne mase: <font color='#66CC66' size='3'>"+ vrstice7[j].zdravbmi.toFixed(2) + "</font> <br> Na dan " + vrstice7[j].datum2 + "</p>";
            }
            var zdravaPrehrana= "<p> Vaša prehrana se glede na meritve zdi uravnotežena, vseeno pa si lahko pogledate spodnji povezavi: </p><p onclick='vec()'><u>Več>></u></p>";
            var zdravTrening= "<p> Glede na meritve izgleda, da se gibljete dovolj, vseeno pa si lahko pogledate spodnji povezavi:</p><p onclick='vec2()'><u>Več>></u></p>";
            var lenaritis= "<p><font color='#66CC66' size='3'>Glede na vaše meritve izgleda, da ste zdravi, le tako naprej!</font></p> ";
            $("#rezultatNapoved2").append(podatkov7);
            $("#prehranaTekst").append(zdravaPrehrana);
                    $("#treningTekst").append(zdravTrening);
                    $("#lenarjenjeTekst").append(lenaritis);



           

                },
               error: function(err) {
        $("#napovedSporocilo").html("<p class='label label-warning '> Prislo je do napake:</p>"+ JSON.parse(err.responseText).userMessage);
                console.log(JSON.parse(err.responseText).userMessage);
            }

            });
    		
    	}
    
    },
    	    error: function(err) {
    	$("#napovedSporocilo").html("<p class='label label-warning '> Prislo je do napake:</p>"+ JSON.parse(err.responseText).userMessage);
				console.log(JSON.parse(err.responseText).userMessage);
			}


    		});
    	
    		
    	}

    		},//6 aql
    		error: function(err) {
    	$("#napovedSporocilo").html("<p class='label label-warning '> Prislo je do napake:</p>"+ JSON.parse(err.responseText).userMessage);
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});

    		
    	}//5aql
    },
    	    error: function(err) {
    	$("#napovedSporocilo").html("<p class='label label-warning '> Prislo je do napake:</p>"+ JSON.parse(err.responseText).userMessage);
				console.log(JSON.parse(err.responseText).userMessage);
			}


    		});
    	
    		
    	}
    		
    	//4aql
    },
    	    error: function(err) {
    	$("#napovedSporocilo").html("<p class='label label-warning '> Prislo je do napake:</p>"+ JSON.parse(err.responseText).userMessage);
				console.log(JSON.parse(err.responseText).userMessage);
			}


    		});
    	
    		
    	}//3aql
    },
    	    error: function(err) {
    	$("#napovedSporocilo").html("<p class='label label-warning '> Prislo je do napake:</p>"+ JSON.parse(err.responseText).userMessage);
				console.log(JSON.parse(err.responseText).userMessage);
			}


    		});
    	}// do tukaj je 2 aql
    },

    error: function(err) {
    	$("#napovedSporocilo").html("<p class='label label-warning '> Prislo je do napake:</p>"+ JSON.parse(err.responseText).userMessage);
				console.log(JSON.parse(err.responseText).userMessage);
    		}
			});
			},
			error: function(err) {
	    		$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
	    	}
		});	
	}
}


function vec() {
    var linki = "<p> <a href='http://www.fitday.com/'> Fitday.com </a></p>  <p> <a href='http://www.myfitnesspal.com/'> MyFitnessPal.com </a></p><p>Pomagajte si s tabelo hranilnih vrednosti</p><span class= 'glyphicon glyphicon-hand-down'> </span><span class= 'glyphicon glyphicon-hand-down'> </span><span class= 'glyphicon glyphicon-hand-down'> </span>";
    $("#prehranaLinki").append(linki);
    
}
function vec2() {
    var linki2 ="<p> <a href='http://www.bodybuilding.com/fun/workout/programs.html'> Bodybuilding.com(mišična masa) </a></p><p> <a href='http://www.bodybuilding.com/fun/workout/cardio.html'> Bodybuilding.com(kardio vadba) </a></p>";
    $("#prehranaLinki2").append(linki2);

}







