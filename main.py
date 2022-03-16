from fileinput import filename
from tkinter.filedialog import asksaveasfilename
from tkinter.filedialog import askopenfilenames
import eel
from numpy import absolute
import pandas as pd
import os
import pathlib
from tkinter import Tk


def readDf(file):
    if file.endswith(".csv") or file.endswith(".tsv"):
        df = pd.read_csv(file, low_memory=False)
    elif file.endswith(".xlsx") or file.endswith(".xls"):
        df = pd.read_excel(file)
    return df


def readDfCols(file):
    if file.endswith(".csv") or file.endswith(".tsv"):
        df = pd.read_csv(file, low_memory=False, nrows=100)
    elif file.endswith(".xlsx") or file.endswith(".xls"):
        df = pd.read_excel(file, nrows=100)
    return df


file_names = []


@eel.expose
def selectFiles():
    global file_names
    root = Tk()
    root.wm_attributes("-topmost", 1)
    root.wm_state("iconic")
    file_names = askopenfilenames(
        title="Open 'csv','xls', or 'xlsx' files", parent=root
    )
    root.destroy()
    all_columns = []
    for file in file_names:
        df = readDfCols(file)
        for x in df.columns:
            all_columns.append(x)
    all_columns = list(dict.fromkeys(all_columns))
    files_and_columns = [all_columns, file_names]

    return files_and_columns


eel.init("web")
filenames = []


eel.start("index.html", size=(1000, 600))