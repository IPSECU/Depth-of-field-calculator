//	The following scripts (doSelectFormat() and doDepthOfField() were modified from source found 
//	on The JavaScript Source!! http://javascript.internet.com -->
//	Original script:  alistair@silverlight.co.uk -->
//	Web Site:  http://www.silverlight.co.uk -->
//	Modified script: Copyright 2007 Don Fleming. All Rights Reserved. http://www.dofmaster.com -->

//Without limiting the rights under copyright reserved above,
//no part of this script may be reproduced, stored in or
//introduced into a retrieval system, or transmitted, in any form
//or by any means (electronic, mechanical, photocopying,
//recording or otherwise), without the prior permission of the
//copyright owner.
//
//The uploading and distribution of this script via the Internet or
//via any other means without the permission of the copyright
//owner is illegal and punishable by law. Please do not
//participate in or encourage electronic piracy of copyrighted
//materials. Your support of the author’s rights is appreciated.

// function to calculate depth of field numbers
// when selections change
function doSelectFormat()
{
	// put the coc on the form
	CoC = parseFloat(document.getElementById("format").value);
	document.getElementById("cocused").value = CoC;

	// calculate
	doDepthOfField();
}

function getFormat()
{
}

var bLoadingPage = false;

function onLoadCalculator() // onload function for dofjs.html
{
	bLoadingPage = true;
	
	getCookie();
	
	doDepthOfField();	
	
	bLoadingPage = false;
}

var savedFormat = 0.019;
var savedUnits = 0.3048;
var savedFocal = 55.0;
var savedAperture = 16.0;
var savedFormatIndex = 0;
var savedUnitsIndex = 0;
var savedFocalIndex = 167;
var savedApertureIndex = 29;

// Calculate all depth of field numbers
function doDepthOfField() 
{
	// get input data from the form
	var distance = parseFloat(document.getElementById("distance").value);
	var CoC = parseFloat(document.getElementById("format").value);
	var aperture = parseFloat(document.getElementById("aperture").value);
	var focal = parseFloat(document.getElementById("focal").value);
	var units = parseFloat(document.getElementById("units").value);

		// input error checking
	if (isNaN(CoC) || CoC < 0.0001)
	{
		document.getElementById("format").selectedIndex = savedFormatIndex ;
		CoC = savedFormat ;
	}
	if (isNaN(units) || units < 0.001)
	{
		document.getElementById("units").selectedIndex = savedUnitsIndex ;
		units = savedUnits ;
		
	}
	if (isNaN(focal) || focal < 0.0001)
	{
		document.getElementById("focal").selectedIndex = savedFocalIndex ;
		focal = savedFocal ;
	}
	if (isNaN(aperture) || aperture < 0.0001)
	{
		document.getElementById("aperture").selectedIndex = savedApertureIndex;
		aperture = savedAperture ;
	}

	// check if distance input is OK
	var bCalcDistance = true;
	if (isNaN(distance) || distance <= 0.0)  
		bCalcDistance = false;

	savedApertureIndex = document.getElementById("aperture").selectedIndex;
	savedFocalIndex = document.getElementById("focal").selectedIndex; 
	savedUnitsIndex = document.getElementById("units").selectedIndex;
	savedFormatIndex= document.getElementById("format").selectedIndex;
	savedAperture = aperture;
	savedCoC = CoC;
	savedFocal = focal;
	savedUnits = units;	
	setCookie(document.getElementById("focal").options[savedFocalIndex].text,
				savedFocalIndex,
				document.getElementById("aperture").options[savedApertureIndex].text,
				savedApertureIndex,
				document.getElementById("format").options[savedFormatIndex].text,
				savedFormatIndex,
				document.getElementById("units").options[savedUnitsIndex].text,
				savedUnitsIndex);

	
	// calculate hyperfocal and near distance
	var hyperFocal = (focal * focal) / (aperture * CoC) + focal;
		
	var dofNear = 0.0;
	var dofFar = 0.0;
	var dofTotal = 0.0;
	var dofNearPercent = 0.0;
	var dofFarPercent = 0.0;
  var totalWidth;
  var elementWidth;

	if (bCalcDistance)
	{
		distance = distance*1000*units; // convert to millimeters
		dofNear = ((hyperFocal - focal) * distance) / (hyperFocal + distance - (2*focal));
	
		// Prevent 'divide by zero' when calculating far distance.
		if ( (hyperFocal - distance) <= 0.00001)
			dofFar = 10000000.0; // set infinity at 10000m
		else
			dofFar = ((hyperFocal-focal) * distance) / (hyperFocal - distance);

		// Calculate percentage of DOF in front and behind the subject.
		dofNearPercent = (distance - dofNear)/(dofFar-dofNear) * 100.0;
		dofFarPercent = (dofFar - distance)/(dofFar-dofNear) * 100.0;

		// Convert depth of field numbers to proper units
		dofNear = dofNear / 1000.0 / units;
		dofFar  = dofFar / 1000.0 / units;
		dofTotal = dofFar - dofNear;
		distance = distance / 1000.0 / units;
	}		

	// convert hyperfocal distance to proper units
	hyperFocal = hyperFocal / 1000.0 / units;
		
	// set the units string
	if (units > 0.4)
		unitsString = "&nbsp;m";
	else if (units < 0.02)
		unitsString = "&nbsp;cm";
	else if (units < 0.1)
		unitsString = "&nbsp;in";
	else
	  	unitsString = "&nbsp;ft";
		
	// transfer values to the form
	if (hyperFocal < 10.0)
	{
		document.getElementById("hyperFocal").innerHTML  = Math.round(hyperFocal*100)/100 + unitsString;
		document.getElementById("diagramHyperfocal").innerHTML =  "Focus&nbsp;at&nbsp;the&nbsp;hyperfocal<br>distance, " +
																													 	 Math.round(hyperFocal*100)/100 + unitsString;
		document.getElementById("diagramHalfHyperfocal").innerHTML = "Depth&nbsp;of&nbsp;field&nbsp;extends&nbsp;from<br>" +
																													 	 Math.round(hyperFocal*100)/200 + unitsString + "&nbsp;to&nbsp;infinity";
	}
	else
	{
		document.getElementById("hyperFocal").innerHTML  = Math.round(hyperFocal*10)/10 + unitsString;
		document.getElementById("diagramHyperfocal").innerHTML = "Focus at the hyperfocal<br>distance, " +
																													 	 Math.round(hyperFocal*10)/10 + unitsString;
		document.getElementById("diagramHalfHyperfocal").innerHTML = "Depth&nbsp;of&nbsp;field&nbsp;extends&nbsp;from<br>" +
																													 	 Math.round(hyperFocal*10)/20 + unitsString + "&nbsp;to&nbsp;infinity";
	}
		
	if (bCalcDistance)
	{
	
	  if (distance < 10.0)
		{
		 document.getElementById("diagramDistance").innerHTML = "Focus&nbsp;at&nbsp;the&nbsp;subject distance,&nbsp;" + Math.round(distance*100)/100 + unitsString;
		 document.getElementById("resultsDistance").innerHTML = Math.round(distance*100)/100 + unitsString;
		 
		}
		else
		{
		 document.getElementById("diagramDistance").innerHTML = "Focus&nbsp;at&nbsp;the&nbsp;subject&nbsp;distance,&nbsp;" + Math.round(distance*10)/10 + unitsString;
		 document.getElementById("resultsDistance").innerHTML = Math.round(distance*10)/10 + unitsString;
		}
		
		if (dofNear < 10.0)
		{
			 		document.getElementById("dofNear").innerHTML = Math.round(dofNear*100)/100 + unitsString;
			 		document.getElementById("diagramNear").innerHTML = Math.round(dofNear*100)/100 + unitsString;
		}
		else
		{
  	 			document.getElementById("dofNear").innerHTML = Math.round(dofNear*10)/10 + unitsString;
  	 			document.getElementById("diagramNear").innerHTML = Math.round(dofNear*10)/10 + unitsString;
		}
  
		if ( dofFar < 10000.0)
		{	
			if (dofFar < 10.0)
			{
	      	document.getElementById("dofFar").innerHTML  = Math.round(dofFar*100)/100 + unitsString;
					document.getElementById("diagramFar").innerHTML = Math.round(dofFar*100)/100 + unitsString;
			}
     	else
			{
      		document.getElementById("dofFar").innerHTML  = Math.round(dofFar*10)/10 + unitsString;
      		document.getElementById("diagramFar").innerHTML  = Math.round(dofFar*10)/10 + unitsString;
			}
				
			if (dofTotal < 10.0)
			{
      		document.getElementById("dofTotal").innerHTML  = Math.round(dofTotal*100)/100 + unitsString;
      		document.getElementById("diagramTotal").innerHTML  = Math.round(dofTotal*100)/100 + unitsString;

					document.getElementById("dofFront").innerHTML = Math.round((distance-dofNear)*100)/100 + unitsString +
											"\t(" + Math.round(dofNearPercent) + "%)";
					document.getElementById("dofRear").innerHTML = Math.round((dofFar - distance)*100)/100 + unitsString +
											"\t(" + Math.round(dofFarPercent)  +  "%)";
			}
     		else
			{
      			document.getElementById("dofTotal").innerHTML  = Math.round(dofTotal*10)/10 + unitsString;
      			document.getElementById("diagramTotal").innerHTML  = Math.round(dofTotal*10)/10 + unitsString;
						
				document.getElementById("dofFront").innerHTML = Math.round((distance-dofNear)*10)/10 + unitsString +
				              "\t(" + Math.round(dofNearPercent) + "%)";
				document.getElementById("dofRear").innerHTML = Math.round((dofFar - distance)*10)/10 + unitsString +
											"\t(" + Math.round(dofFarPercent)  +  "%)";
			}
		}
		else
		{
    		document.getElementById("dofFar").innerHTML  = "Infinity";
    		document.getElementById("dofTotal").innerHTML  = "Infinite";
    		document.getElementById("diagramFar").innerHTML  = "Infinity";
    		document.getElementById("diagramTotal").innerHTML  = "Infinite";
			document.getElementById("dofFront").innerHTML = Math.round((distance-dofNear)*10)/10 + unitsString;
			document.getElementById("dofRear").innerHTML = "Infinite";
		}

		//
		//totalWidth = 665.0;

		//elementWidth = 665.0 - 4.0*647.0/dofNear;
		//document.getElementById("scaleLeftPadding").width = elementWidth;
		//totalWidth = totalWidth - elementWidth;
		//elementWidth = (4.0*647.0)*((1.0/distance) - (1.0/dofNear));
		//totalWidth = totalWidth - 2.0*elementWidth;
		//document.getElementById("scaleLeft").width = elementWidth-1;
		//document.getElementById("scaleRight").width = elementWidth-1;
		//document.getElementById("scaleRightPadding").width = totalWidth;
		
	}
	else
	{
		document.getElementById("dofFar").innerHTML = " ";
  		document.getElementById("dofNear").innerHTML = " ";
  		document.getElementById("dofTotal").innerHTML = " ";
		document.getElementById("dofFront").innerHTML = " ";
		document.getElementById("dofRear").innerHTML = " ";
		
 		document.getElementById("diagramNear").innerHTML  = " ";
 		document.getElementById("diagramFar").innerHTML  = " ";
 		document.getElementById("diagramTotal").innerHTML  = " ";
		document.getElementById("diagramDistance").innerHTML  = " ";
 		document.getElementById("resultsDistance").innerHTML  = " ";
		
		
	}

	// set the CoC value on the form		
	document.getElementById("cocused").innerHTML = CoC + " mm"
}




function setCookie(focalText, focalIndex, apertureText, apertureIndex, formatText,
				   formatIndex, unitsText, unitsIndex)
{
	if (true == bLoadingPage)
		return;
		
	document.cookie = "focalText="+focalText;
	document.cookie = "focalIndex="+focalIndex;
	
	document.cookie = "apertureText="+apertureText;
	document.cookie = "apertureIndex="+apertureIndex;
	
	document.cookie = "formatText="+formatText;
	document.cookie = "formatIndex="+formatIndex;
	
	document.cookie = "unitsText="+unitsText;
	document.cookie = "unitsIndex="+unitsIndex;
	
	expireDate = new Date;
	expireDate.setMonth(expireDate.getMonth()+12);
	document.cookie = "expires="+expireDate.toUTCString();
}

function getCookie()
{
	if (document.cookie != "")
	{
		
		var focalIndex, focalText, apertureIndex, apertureText, unitsIndex, unitsText, formatIndex, formatText;
		unitsIndex = apertureIndex = focalIndex = formatIndex = 0;
		focalText = "";
		apertureText = "";
		unitsText = "";
		formatText = "";
		
		var i, cookieName, cookieValue;
		var thisCookie = document.cookie.split("; ");
		for (i = 0; i < thisCookie.length; i++)
		{
			cookieName = thisCookie[i].split("=")[0];
			cookieValue = thisCookie[i].split("=")[1];
			
			switch (cookieName)
			{
				case "focalIndex":
					focalIndex = parseInt(cookieValue);
					break;
				case "focalText":
					focalText = cookieValue;
					break;
				case "apertureIndex":
					apertureIndex = parseInt(cookieValue);
					break;
				case "apertureText":
					apertureText = cookieValue;
					break;
				case "unitsIndex":
					unitsIndex = parseInt(cookieValue);
					break;
				case "unitsText":
					unitsText = cookieValue;
					break;
				case "formatIndex":
					formatIndex = parseInt(cookieValue);
					break;
				case "formatText":
					formatText = cookieValue;
					break;
				default:
					break;
			}
		}			

		
		if (formatText == document.getElementById("format").options[formatIndex].text)
			document.getElementById("format").selectedIndex = formatIndex;
		if (apertureText == document.getElementById("aperture").options[apertureIndex].text)
			document.getElementById("aperture").selectedIndex = apertureIndex;
		if (unitsText == document.getElementById("units").options[unitsIndex].text)
			document.getElementById("units").selectedIndex = unitsIndex;
		if (focalText == document.getElementById("focal").options[focalIndex].text)
			document.getElementById("focal").selectedIndex = focalIndex;
	}
}
