# [Qlik Sense](https://www.qlik.com/us/products/qlik-sense) Reboot Timeline

##  Screenshots

Timeline with each bar on own line:
![](notgruped.PNG)

Timeline with grouped bars into one line based on first dimension:
![](gruped.PNG)


## Usage

Dimensions:

- Dimension 1 (required): Main dimension and row label
- Dimension 2 (optional): Bar label
- Dimension 3 (required): Start datetime
- Dimension 4 (required): End datetime

Measures:
There is no measure.

DateFormats:

- Dates require to be in the standard ISO format:
    - YYYY-MM-DD just the date
    - YYYY-MM-DD hh:mm{:ss} full date with time (seconds are optional)



##  Sources

- GitHub: https://github.com/plzaart/multicolored_timeline
- Qlik Branch: http://branch.qlik.com/#!/project/5a9987d324c6aa484f158acf
- Note please that this solution was created based on these two projects: 
    -https://github.com/kai/qlik-sense-timeline
    -https://github.com/plzaart/multicolored_timeline


##  License

MIT License
