from pyaxis import pyaxis
import pandas as pd

def extraire_colonnes(px):
	titre_de = px['METADATA']["HEADING"][0]
	titre = px['METADATA']["HEADING[fr]"][0]
	col_headers_de = px['METADATA'][f"VALUES({titre_de})"]
	col_headers_fr = px['METADATA'][f"VALUES[fr]({titre})"]
	col_headers = ["total", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

	colonnes_traductions = zip(col_headers_de, col_headers)
	colonnes_traductions = dict(colonnes_traductions)
	return titre_de, colonnes_traductions

def traiter_px(filename):
	px = pyaxis.parse(filename, encoding='ISO-8859-1')
	heading_de, colonnes_traductions = extraire_colonnes(px)
	colonnes_a_garder = list(colonnes_traductions.values())[0:13]

	df = px["DATA"]
	df = df.rename(columns = {"Jahr": "year"})
	df = df.pivot(index='year', columns=heading_de)
	df.columns = df.columns.map(lambda t: t[1])
	df = df.rename(columns = colonnes_traductions)
	df = df[colonnes_a_garder] # garder seulement les valeurs mensuelles et le total annuel
	df = df.replace('"..."','')
	#df = df.iloc[1877-1803: , :] # garder seulement les valeurs dès 1877 (début du détail mensuel)
	df.to_csv(filename + ".csv")
	return df

mortalite = traiter_px("./mortalite.px")
mortalite = mortalite.rename(columns = lambda nomcol: "deaths_"+nomcol)
natalite = traiter_px("./natalite.px")
natalite = natalite.rename(columns = lambda nomcol: "births_"+nomcol)
final = pd.concat([natalite, mortalite], axis=1, join="inner")
final.to_csv("final.csv")
