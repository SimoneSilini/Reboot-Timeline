# [Qlik Sense](https://www.qlik.com/us/products/qlik-sense) Reboot Timeline

##  Screenshots

Timeline with each bar on own line:
![](notgruped.PNG)

Timeline with grouped bars into one line based on first dimension:
![](gruped.PNG)


## Usage

###Dimensions:

- Dimension 1 (required): Main dimension and row label
- Dimension 2 (optional): Bar label
- Dimension 3 (optional): Bar color or Bar Tooltip
- Dimension 4 (optional): Bar Tooltip
- Dimension 5 (required): Start datetime
- Dimension 6 (required): End datetime

####Bar Color
You need a column in your data table with Hex color codes like #FFFFFF.

####Bar Tooltip
This can be set from the third dimension, if you have 5 dimensions and set the colors or tooltip button to tooltip (see Front end configuration -> Appearance settings).    
You can use html code to format this value, for example \<br> for new line and \<b> for bold text.     
For example in your data load editor you can create something like this:

'\<b>Duration:\</b> ' & Interval(EndDatetime-BeginDatetime, 'HH:mm') &' minutes' &
'\<br>\<b>Product:\</b> ' & Product_Code_Number &'\<br>\<b>Work Order:\</b> ' & Work_Order AS Tooltip_Column

You need to add Tooltip_Column as 4th dimension (or as third) and you'll see a 3 line tooltip with the data.

###Measures:
There is no measure.

DateFormats:

- Dates require to be in the standard ISO format:
    - YYYY-MM-DD just the date
    - YYYY-MM-DD hh:mm{:ss} full date with time (seconds are optional)


## Front-End Configuration
Appearance Settings:

- General: standard Qlik Sesnse general appearence settings for titles etc
- Show Row Labels: boolean switch -> display or not the label on the left of the chart
- Group Row Labels: boolean switch -> group lines with the same label name (as the second image shows)
- Colors:
    * Use Single Color: boolean switch -> use the same color for all the bars (require Single Color Expression) 
    * Single Color Expression: string -> the hex code of the color for all the bars
    * Color by Row Label -> Same color for all the bars with the same label (requires optional bar label dimension)
    * Background color -> string -> the hex code of the color for the background  
- Date Format: let you insert the date format (https://en.wikipedia.org/wiki/ISO_8601)
    * you can use if condition to dinamically change the format i.e: = If(GetSelectedCount(Data) = 1 OR GetPossibleCount(Data) = 1, 'HH:mm', 'd/M/yy') 
- Colors or Tooltip: This is required if you use 5 dimensions, let you choose if you want to use the third dimension as a Color or as a Tooltip. (has no effect if you has 3, 4 or 6 dimensions)



##  Sources

- GitHub: https://github.com/SimoneSilini/Reboot-Timeline
- Qlik Branch: https://developer.qlik.com/garden/5c38a38f1f9bf60010baa65e
- Note please that this solution was created based on these two projects: 
    
    https://github.com/kai/qlik-sense-timeline
    https://github.com/plzaart/multicolored_timeline


##  License

MIT License
