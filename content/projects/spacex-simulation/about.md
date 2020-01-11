Creates data to populate a simple but non-trivial database for my Databases class. First it uses [Curl](https://curl.haxx.se/) to download a complete SpaceX mission manifest from [this open source REST API](https://github.com/r-spacex/SpaceX-API). Then it parses the downloaded JSON data using the [RapidJSON Library](http://rapidjson.org/). Afterwards, it performs a simulation to generate hypothetical future launch data. Many variables are simulated such as maximum reflights of cores, payload masses limited to launch configuration limits for any destination orbit, and dates that follow real world calendar rules such as everything from months having the correct number of days to properly handling leap years. Finally, the program outputs the conglomeration of real world and simulated data into a database by either directly connecting to the database or by printing out the results into a text file that can be read into the database manually.