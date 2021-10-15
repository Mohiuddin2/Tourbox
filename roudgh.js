{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "**Question 1.1** (30 points): We will retrieve the  information from the top 100 songs on [Spotifycharts](https://spotifycharts.com/) on September 30th-October 4th. For each day on the list, we can scrape the following characteristics from the information page. For example, from the [\"Global Top 200 on September 30\"](https://spotifycharts.com/regional/global/daily/2021-09-30), we want to extract the information about the top song **STAY** as:\n",
    "- spotify id (5PjdY0CKGZdEuoNab3yDmX)\n",
    "- Song name (STAY (with Justin Bieber))\n",
    "- Artist (The Kid LAROI)\n",
    "- Number of streams (7,714,466)\n",
    "\n",
    "![spotifycharts](https://aristake.com/wp-content/uploads/2021/09/Spotify-charts-HEADER-1.png)\n",
    "\n",
    "\n",
    "After scraping the top 100 songs, save the data as a dataframe ```spotify_top_songs_global```. \n",
    "\n",
    "Then similarly, let's try to scrape information from the top 100 songs of Portugal market and Japanese market on Septebmer 30th-October 4th, respectively. save the data as dataframes ```spotify_top_songs_portugal``` and ```spotify_top_songs_japan```.\n",
    "\n",
    "\n",
    "You can concatenate these three dataframes as ```spotify_top_songs``` for next question. \n",
    "\n",
    "Note: if you are not able to scrape the data, download the csv files from the top right corner of the website, but you will not receive the scores from this question.\n",
    "\n",
    "Hint: you can play with the website to check the correct url for each chart."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Question 1.1\n",
    "\n",
    "scraper = cloudscraper.create_scraper()  # returns a CloudScraper instance\n",
    "# Or: scraper = cloudscraper.CloudScraper()  # CloudScraper inherits from requests.Session\n",
    "page = scraper.get(##your_url_here)\n",
    "print(page.text)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "pip install cloudscraper"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "import cloudscraper\n",
    "from bs4 import BeautifulSoup\n",
    "import pandas as pd\n",
    "def scrape_page(country,day):\n",
    "    url=\"https://spotifycharts.com/regional/\" + country + \"/daily/\" + day\n",
    "    scraper = cloudscraper.create_scraper() # returns a CloudScraper instance\n",
    "    page = scraper.get(url)\n",
    "    soup = BeautifulSoup(page.content, 'html.parser')\n",
    "    songs = soup.find(\"table\", {\"class\": \"chart-table\"}) \n",
    "    titles_list = []\n",
    "    artists_list = []\n",
    "    songid_list = []\n",
    "    stream_list = [] #title\n",
    "    for my_tag in soup.find_all(class_=\"chart-table-track\"):\n",
    "        for i in soup.find_all('strong'):\n",
    "            title = i.text\n",
    "            titles_list.append(title) #artist\n",
    "    for tr in songs.find(\"tbody\").findAll(\"tr\"):\n",
    "        artist = tr.find(\"td\", {\"class\": \"chart-table-track\"}).find(\"span\").text\n",
    "        artist = artist.replace(\"by \", \"\").strip()\n",
    "        artists_list.append(artist) # #songid\n",
    "    for tr in songs.find(\"tbody\").findAll(\"tr\"):\n",
    "        songid= tr.find(\"td\", {\"class\": \"chart-table-image\"}).find(\"a\").get(\"href\")\n",
    "        songid= songid.split(\"track/\")[1]\n",
    "        songid_list.append(songid) # # Streams\n",
    "    for tr in songs.find(\"tbody\").findAll(\"tr\"):\n",
    "        stream = tr.find(\"td\", {\"class\": \"chart-table-streams\"}).text\n",
    "        stream_list.append(stream) #final.append([songid, title, artist,streams])\n",
    "    songid_df = pd.DataFrame(songid_list, columns=[\"Song ID\"])\n",
    "    title_df = pd.DataFrame(titles_list, columns=[\"Title\"])\n",
    "    artist_df = pd.DataFrame(artists_list, columns=[\"Artist\"])\n",
    "    stream_list_df = pd.DataFrame(stream_list, columns=[\"Streams\"]) \n",
    "    songid_df[\"Title\"] = title_df\n",
    "    songid_df[\"Artist\"] = artist_df\n",
    "    songid_df[\"Nr of Streams\"] = stream_list_df\n",
    "    songid_df[\"Country\"] = country\n",
    "    songid_df[\"Day\"] = day \n",
    "    scraped_data = songid_df.head(100)\n",
    "    return scraped_data\n",
    "\n",
    "print('Scraping Global...')\n",
    "spotify_top_songs_global_20210930 = scrape_page(\"global\",\"2021-09-30\")\n",
    "spotify_top_songs_global_20211001 = scrape_page(\"global\",\"2021-10-01\")\n",
    "spotify_top_songs_global_20211002 = scrape_page(\"global\",\"2021-10-02\")\n",
    "spotify_top_songs_global_20211003 = scrape_page(\"global\",\"2021-10-03\")\n",
    "spotify_top_songs_global_20211004 = scrape_page(\"global\",\"2021-10-04\")\n",
    "print('Scraping PT...')\n",
    "spotify_top_songs_pt_20210930 = scrape_page(\"global\",\"2021-09-30\")\n",
    "spotify_top_songs_pt_20211001 = scrape_page(\"pt\",\"2021-10-01\")\n",
    "spotify_top_songs_pt_20211002 = scrape_page(\"pt\",\"2021-10-02\")\n",
    "spotify_top_songs_pt_20211003 = scrape_page(\"pt\",\"2021-10-03\")\n",
    "spotify_top_songs_pt_20211004 = scrape_page(\"pt\",\"2021-10-04\")\n",
    "print('Scraping JP...')\n",
    "spotify_top_songs_jp_20210930 = scrape_page(\"jp\",\"2021-09-30\")\n",
    "spotify_top_songs_jp_20211001 = scrape_page(\"jp\",\"2021-10-01\")\n",
    "spotify_top_songs_jp_20211002 = scrape_page(\"jp\",\"2021-10-02\")\n",
    "spotify_top_songs_jp_20211003 = scrape_page(\"jp\",\"2021-10-03\")\n",
    "spotify_top_songs_jp_20211004 = scrape_page(\"jp\",\"2021-10-04\")\n",
    "frames = [spotify_top_songs_global_20210930, spotify_top_songs_global_20211001, \n",
    "          spotify_top_songs_global_20211002, spotify_top_songs_global_20211003, spotify_top_songs_global_20211004,\n",
    "          spotify_top_songs_pt_20210930, spotify_top_songs_pt_20211001, spotify_top_songs_pt_20211002, \n",
    "          spotify_top_songs_pt_20211003, spotify_top_songs_pt_20211004,\n",
    "          spotify_top_songs_jp_20210930, spotify_top_songs_jp_20211001, \n",
    "          spotify_top_songs_jp_20211002, spotify_top_songs_jp_20211003, spotify_top_songs_jp_20211004]\n",
    "spotify_top_songs = pd.concat(frames)\n",
    "spotify_top_songs.to_csv('spotify_top_songs.csv')"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "**Question 1.2** (20 points) Now you need to go to Spotify platform to use its API to further get more information. You could find very detailed [documentation](https://developer.spotify.com/documentation/web-api/) that should guide you with the entire process. \n",
    "\n",
    "First, you need to get the audio features from the songs in the ```spotify_top_songs```. You could check the API for getting audio features for several tracks [here](https://developer.spotify.com/console/get-audio-features-several-tracmks/). Essentially, you need to call the [API endpoint](https://developer.spotify.com/console/get-audio-features-several-tracks/), which gives the very detailed explanations. Then you should receive the [Audio feature object](https://developer.spotify.com/documentation/web-api/reference/#object-audiofeaturesobject) in json files, save it as the dataframe ```spotify_top_songs_acoustic_features``` with these features:\n",
    "- danceability\n",
    "- energy\n",
    "- key\n",
    "- loudness\n",
    "- mode\n",
    "- speechiness\n",
    "- acousticness\n",
    "- instrumentalness\n",
    "- liveness\n",
    "- valence\n",
    "- tempo\n",
    "- id\n",
    "- duration_ms\n",
    "- time_signature\n",
    "\n",
    "Note: if you are not able to get this data, download the csv file from the moodle to continue the analysis, but you will not receive the grade from this question.\n",
    "\n",
    "Hint1: when you request acoustic features from multiple tracks, the url would involve the track id connected by ```%2C```. For example, for two tracks STAY (4JpKVNYnVcJ8tuMKjAj50A), and INDUSTRY Baby (5Z9KJZvQzH6PFmb8SNkxuk), you could search for its url as: `https://api.spotify.com/v1/audio-features?ids=4JpKVNYnVcJ8tuMKjAj50A%2C5Z9KJZvQzH6PFmb8SNkxuk`\n",
    "\n",
    "Hint2: Spotify requires certain authentication (token) to have access to its data. You need to go to Spotify [developer platform](https://developer.spotify.com/console/get-audio-features-several-tracks/) to request a token and include the token in the requests. It may get expired if you have not used it for a while, then you just need to request a new one.\n",
    "\n",
    "Hint3: Spotify restricts the number of tracks to be requested in each API call (up to 100), so you may need to do it several times seprately and then combine them later."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# request a new token from Spotify to replace the below one\n",
    "access_token = 'BQA7LE6nTk7ZNdr0vZNOwRB1lPcq5vC7AWKttE3XnSuDmFehxFbtFU9cTT8-OJtTSx7fxHe3GXWuBDS9eKRMDE7ftVFWdmiDmK9xXv2nqueWy2PQK5OjSWKnpoI-QLm9lQlIwK3N3TY2ZUP68UyeY-JwJGfdB-NumtKJDCqpQiyU7FzlrN4cRuGAFrPjGF9iBnrvCREwBO2Im0RDf54YJu_C_Ebhd2H6uFJlDaUCIWIhiN-r0N_qRCjYMJEUy-dEl_M0cCHFVCfynZJ9g_H5'\n",
    "headers = {\n",
    "    'Authorization': 'Bearer {token}'.format(token=access_token)\n",
    "}"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "response = requests.get(url_part1, headers=headers)\n"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "**Quesion 1.3** (5 points) \n",
    "Merge dataframes ```spotify_top_songs_acoustic_features``` with ```spotify_top_songs``` and to enrich with the acoustic features, check the resulting number of rows and columns."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {},
   "outputs": [
    {
     "ename": "FileNotFoundError",
     "evalue": "[Errno 2] No such file or directory: 'regional-global-daily-latest.csv'",
     "output_type": "error",
     "traceback": [
      "\u001b[0;31m---------------------------------------------------------------------------\u001b[0m",
      "\u001b[0;31mFileNotFoundError\u001b[0m                         Traceback (most recent call last)",
      "\u001b[0;32m<ipython-input-2-77a63bc7744d>\u001b[0m in \u001b[0;36m<module>\u001b[0;34m\u001b[0m\n\u001b[1;32m      4\u001b[0m \u001b[0;31m# (in the same directory that your python process is based)\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[1;32m      5\u001b[0m \u001b[0;31m# Control delimiters, rows, column names with read_csv (see later)\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0;32m----> 6\u001b[0;31m \u001b[0mdata\u001b[0m \u001b[0;34m=\u001b[0m \u001b[0mpd\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0mread_csv\u001b[0m\u001b[0;34m(\u001b[0m\u001b[0;34m\"regional-global-daily-latest.csv\"\u001b[0m\u001b[0;34m)\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0m\u001b[1;32m      7\u001b[0m \u001b[0mdata\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n",
      "\u001b[0;32m~/opt/anaconda3/lib/python3.8/site-packages/pandas/io/parsers.py\u001b[0m in \u001b[0;36mread_csv\u001b[0;34m(filepath_or_buffer, sep, delimiter, header, names, index_col, usecols, squeeze, prefix, mangle_dupe_cols, dtype, engine, converters, true_values, false_values, skipinitialspace, skiprows, skipfooter, nrows, na_values, keep_default_na, na_filter, verbose, skip_blank_lines, parse_dates, infer_datetime_format, keep_date_col, date_parser, dayfirst, cache_dates, iterator, chunksize, compression, thousands, decimal, lineterminator, quotechar, quoting, doublequote, escapechar, comment, encoding, dialect, error_bad_lines, warn_bad_lines, delim_whitespace, low_memory, memory_map, float_precision)\u001b[0m\n\u001b[1;32m    684\u001b[0m     )\n\u001b[1;32m    685\u001b[0m \u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0;32m--> 686\u001b[0;31m     \u001b[0;32mreturn\u001b[0m \u001b[0m_read\u001b[0m\u001b[0;34m(\u001b[0m\u001b[0mfilepath_or_buffer\u001b[0m\u001b[0;34m,\u001b[0m \u001b[0mkwds\u001b[0m\u001b[0;34m)\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0m\u001b[1;32m    687\u001b[0m \u001b[0;34m\u001b[0m\u001b[0m\n\u001b[1;32m    688\u001b[0m \u001b[0;34m\u001b[0m\u001b[0m\n",
      "\u001b[0;32m~/opt/anaconda3/lib/python3.8/site-packages/pandas/io/parsers.py\u001b[0m in \u001b[0;36m_read\u001b[0;34m(filepath_or_buffer, kwds)\u001b[0m\n\u001b[1;32m    450\u001b[0m \u001b[0;34m\u001b[0m\u001b[0m\n\u001b[1;32m    451\u001b[0m     \u001b[0;31m# Create the parser.\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0;32m--> 452\u001b[0;31m     \u001b[0mparser\u001b[0m \u001b[0;34m=\u001b[0m \u001b[0mTextFileReader\u001b[0m\u001b[0;34m(\u001b[0m\u001b[0mfp_or_buf\u001b[0m\u001b[0;34m,\u001b[0m \u001b[0;34m**\u001b[0m\u001b[0mkwds\u001b[0m\u001b[0;34m)\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0m\u001b[1;32m    453\u001b[0m \u001b[0;34m\u001b[0m\u001b[0m\n\u001b[1;32m    454\u001b[0m     \u001b[0;32mif\u001b[0m \u001b[0mchunksize\u001b[0m \u001b[0;32mor\u001b[0m \u001b[0miterator\u001b[0m\u001b[0;34m:\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n",
      "\u001b[0;32m~/opt/anaconda3/lib/python3.8/site-packages/pandas/io/parsers.py\u001b[0m in \u001b[0;36m__init__\u001b[0;34m(self, f, engine, **kwds)\u001b[0m\n\u001b[1;32m    944\u001b[0m             \u001b[0mself\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0moptions\u001b[0m\u001b[0;34m[\u001b[0m\u001b[0;34m\"has_index_names\"\u001b[0m\u001b[0;34m]\u001b[0m \u001b[0;34m=\u001b[0m \u001b[0mkwds\u001b[0m\u001b[0;34m[\u001b[0m\u001b[0;34m\"has_index_names\"\u001b[0m\u001b[0;34m]\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[1;32m    945\u001b[0m \u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0;32m--> 946\u001b[0;31m         \u001b[0mself\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0m_make_engine\u001b[0m\u001b[0;34m(\u001b[0m\u001b[0mself\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0mengine\u001b[0m\u001b[0;34m)\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0m\u001b[1;32m    947\u001b[0m \u001b[0;34m\u001b[0m\u001b[0m\n\u001b[1;32m    948\u001b[0m     \u001b[0;32mdef\u001b[0m \u001b[0mclose\u001b[0m\u001b[0;34m(\u001b[0m\u001b[0mself\u001b[0m\u001b[0;34m)\u001b[0m\u001b[0;34m:\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n",
      "\u001b[0;32m~/opt/anaconda3/lib/python3.8/site-packages/pandas/io/parsers.py\u001b[0m in \u001b[0;36m_make_engine\u001b[0;34m(self, engine)\u001b[0m\n\u001b[1;32m   1176\u001b[0m     \u001b[0;32mdef\u001b[0m \u001b[0m_make_engine\u001b[0m\u001b[0;34m(\u001b[0m\u001b[0mself\u001b[0m\u001b[0;34m,\u001b[0m \u001b[0mengine\u001b[0m\u001b[0;34m=\u001b[0m\u001b[0;34m\"c\"\u001b[0m\u001b[0;34m)\u001b[0m\u001b[0;34m:\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[1;32m   1177\u001b[0m         \u001b[0;32mif\u001b[0m \u001b[0mengine\u001b[0m \u001b[0;34m==\u001b[0m \u001b[0;34m\"c\"\u001b[0m\u001b[0;34m:\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0;32m-> 1178\u001b[0;31m             \u001b[0mself\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0m_engine\u001b[0m \u001b[0;34m=\u001b[0m \u001b[0mCParserWrapper\u001b[0m\u001b[0;34m(\u001b[0m\u001b[0mself\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0mf\u001b[0m\u001b[0;34m,\u001b[0m \u001b[0;34m**\u001b[0m\u001b[0mself\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0moptions\u001b[0m\u001b[0;34m)\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0m\u001b[1;32m   1179\u001b[0m         \u001b[0;32melse\u001b[0m\u001b[0;34m:\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[1;32m   1180\u001b[0m             \u001b[0;32mif\u001b[0m \u001b[0mengine\u001b[0m \u001b[0;34m==\u001b[0m \u001b[0;34m\"python\"\u001b[0m\u001b[0;34m:\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n",
      "\u001b[0;32m~/opt/anaconda3/lib/python3.8/site-packages/pandas/io/parsers.py\u001b[0m in \u001b[0;36m__init__\u001b[0;34m(self, src, **kwds)\u001b[0m\n\u001b[1;32m   2006\u001b[0m         \u001b[0mkwds\u001b[0m\u001b[0;34m[\u001b[0m\u001b[0;34m\"usecols\"\u001b[0m\u001b[0;34m]\u001b[0m \u001b[0;34m=\u001b[0m \u001b[0mself\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0musecols\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[1;32m   2007\u001b[0m \u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0;32m-> 2008\u001b[0;31m         \u001b[0mself\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0m_reader\u001b[0m \u001b[0;34m=\u001b[0m \u001b[0mparsers\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0mTextReader\u001b[0m\u001b[0;34m(\u001b[0m\u001b[0msrc\u001b[0m\u001b[0;34m,\u001b[0m \u001b[0;34m**\u001b[0m\u001b[0mkwds\u001b[0m\u001b[0;34m)\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0m\u001b[1;32m   2009\u001b[0m         \u001b[0mself\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0munnamed_cols\u001b[0m \u001b[0;34m=\u001b[0m \u001b[0mself\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0m_reader\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0munnamed_cols\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[1;32m   2010\u001b[0m \u001b[0;34m\u001b[0m\u001b[0m\n",
      "\u001b[0;32mpandas/_libs/parsers.pyx\u001b[0m in \u001b[0;36mpandas._libs.parsers.TextReader.__cinit__\u001b[0;34m()\u001b[0m\n",
      "\u001b[0;32mpandas/_libs/parsers.pyx\u001b[0m in \u001b[0;36mpandas._libs.parsers.TextReader._setup_parser_source\u001b[0;34m()\u001b[0m\n",
      "\u001b[0;31mFileNotFoundError\u001b[0m: [Errno 2] No such file or directory: 'regional-global-daily-latest.csv'"
     ]
    }
   ],
   "source": [
    "# Load the Pandas libraries with alias 'pd' \n",
    "import pandas as pd \n",
    "# Read data from file 'filename.csv' \n",
    "# (in the same directory that your python process is based)\n",
    "# Control delimiters, rows, column names with read_csv (see later) \n",
    "data = pd.read_csv(\"regional-global-daily-latest.csv\")\n",
    "data"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "metadata": {},
   "outputs": [
    {
     "ename": "NameError",
     "evalue": "name 'spotify_top_songs_acoustic_features' is not defined",
     "output_type": "error",
     "traceback": [
      "\u001b[0;31m---------------------------------------------------------------------------\u001b[0m",
      "\u001b[0;31mNameError\u001b[0m                                 Traceback (most recent call last)",
      "\u001b[0;32m<ipython-input-3-29f440827b81>\u001b[0m in \u001b[0;36m<module>\u001b[0;34m\u001b[0m\n\u001b[1;32m      1\u001b[0m \u001b[0;31m# Question 1.3\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0;32m----> 2\u001b[0;31m \u001b[0mdf1\u001b[0m \u001b[0;34m=\u001b[0m \u001b[0mspotify_top_songs_acoustic_features\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0m\u001b[1;32m      3\u001b[0m \u001b[0mdf2\u001b[0m \u001b[0;34m=\u001b[0m \u001b[0mspotify_top_songs\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n",
      "\u001b[0;31mNameError\u001b[0m: name 'spotify_top_songs_acoustic_features' is not defined"
     ]
    }
   ],
   "source": [
    "# Question 1.3\n",
    "df1 = spotify_top_songs_acoustic_features\n",
    "df2 = spotify_top_songs\n"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "**Question 1.4** (5 points) Show the top 3 most popular artists in terms of number of unique songs on chart in global, portugal and japan market, respectively."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Quesion 1.4\n"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "**Question 1.5** (5 points) Show average value of acousitc features of songs in global market by the distribution of duration at quartile (0-25%, 25-50%, 50-75%, 75-100%). "
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Question 1.5\n"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "**Question 1.6** (5 points) Show the top 3 artists with the most total streams in global, portugal and japan markets."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Question 1.6\n"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "**Question 1.7** (5 points) Show the number of songs across the keys (row) and (Portugal/Japan) market (column)."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Question 1.7\n"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "**Question 1.8** (5 points) Show the top 5 artists that has the most number of songs-days in global market (if a song appeared in 2 days, it will be counted as the 2 song-days."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Question 1.8\n"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "**Question 1.9** (10 points) Compare the acoustic features of top songs in Portugal and in Japan, by checking the correlations between rank and acoustic features using Pearman and Spearman correlations.\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": []
  },
  {
   "cell_type": "markdown",
   "metadata": {
    "collapsed": true
   },
   "source": [
    "**Question 1.10** (10 points) \n",
    "Compare the acoustic features of top songs in Portugal and in Japan, by checking whether the differences between feature values are statistically significant or not. Show the features ranked by the absolute magnitude of differences with statistical significance level of at least p<0.05."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": []
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": []
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.8.5"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
