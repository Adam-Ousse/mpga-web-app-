# Sample Data Files

## ⚠️ Important Notice

The sample files in this directory need to be downloaded from NASA Exoplanet Archive because:

1. **Models expect NASA data format** - not FLUX time-series data
2. **Specific column names required** - each dataset has different requirements
3. **Real data works best** - these models were trained on actual NASA data

---

## How to Get Sample Data

### 📥 Kepler Dataset

**Direct Download Link:**
https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nph-nstedAPI/nph-nstedAPI?table=cumulative&format=csv

**Or via website:**
1. Visit: https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=cumulative
2. Click "Download Table" (top right)
3. Select "CSV Format"
4. Save as `sample_kepler.csv` in this directory

**Expected columns include:**
- `kepid`, `kepoi_name`, `kepler_name`
- `koi_disposition` (target - what we're predicting)
- `koi_period`, `koi_duration`, `koi_depth`
- `koi_prad`, `koi_teq`, `koi_insol`
- `koi_steff`, `koi_slogg`, `koi_srad`
- And many more KOI (Kepler Object of Interest) parameters

---

### 📥 K2 Dataset

**Direct Download Link:**
https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nph-nstedAPI/nph-nstedAPI?table=k2candidates&format=csv

**Or via website:**
1. Visit: https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=k2candidates
2. Click "Download Table"
3. Select "CSV Format"
4. Save as `sample_k2.csv` in this directory

**Expected columns include:**
- `pl_name`, `hostname`
- `disposition` (target - what we're predicting)
- `pl_orbper`, `pl_rade`, `pl_masse`
- `pl_eqt`, `st_teff`, `st_rad`
- And more planetary/stellar parameters

---

### 📥 TESS Dataset

**Direct Download Link:**
https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nph-nstedAPI/nph-nstedAPI?table=TOI&format=csv

**Or via website:**
1. Visit: https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=TOI
2. Click "Download Table"
3. Select "CSV Format"
4. Save as `sample_tess.csv` in this directory

**Expected columns include:**
- `toi`, `tid` (TESS ID)
- `tfopwg_disp` (target - what we're predicting)
- `pl_orbper`, `pl_rade`, `pl_eqt`
- `st_tmag`, `st_rad`, `st_mass`, `st_teff`
- And more TOI (TESS Object of Interest) parameters

---

## Quick Download Commands

### Using PowerShell (Windows):

```powershell
# Kepler
Invoke-WebRequest -Uri "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nph-nstedAPI/nph-nstedAPI?table=cumulative&format=csv" -OutFile "sample_kepler.csv"

# K2
Invoke-WebRequest -Uri "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nph-nstedAPI/nph-nstedAPI?table=k2candidates&format=csv" -OutFile "sample_k2.csv"

# TESS
Invoke-WebRequest -Uri "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nph-nstedAPI/nph-nstedAPI?table=TOI&format=csv" -OutFile "sample_tess.csv"
```

### Using curl (Linux/Mac):

```bash
# Kepler
curl "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nph-nstedAPI/nph-nstedAPI?table=cumulative&format=csv" -o sample_kepler.csv

# K2  
curl "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nph-nstedAPI/nph-nstedAPI?table=k2candidates&format=csv" -o sample_k2.csv

# TESS
curl "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nph-nstedAPI/nph-nstedAPI?table=TOI&format=csv" -o sample_tess.csv
```

---

## After Downloading

1. ✅ Files will be in this `sample_data/` directory
2. ✅ Each file will have hundreds or thousands of rows
3. ✅ All required columns will be present
4. ✅ Ready to upload to the web app!

---

## File Sizes

- **Kepler**: ~50-100 MB (9,000+ objects)
- **K2**: ~5-10 MB (1,000+ candidates)
- **TESS**: ~20-40 MB (4,000+ TOIs)

These files are large because they contain ALL discovered/candidate exoplanets from each mission. You can:
- Use the full file for testing
- Create smaller subsets for faster uploads
- Filter to specific rows using Excel/Python

---

## Verifying Your Download

After downloading, check that:

```powershell
# Check file exists and has data
Get-Item sample_kepler.csv | Select-Object Name, Length
Get-Item sample_k2.csv | Select-Object Name, Length
Get-Item sample_tess.csv | Select-Object Name, Length

# View first few lines (check headers)
Get-Content sample_kepler.csv -First 5
```

You should see column headers in the first line that match the expected columns listed above.

---

## Need Help?

If downloads fail:
1. Try using the website method instead of direct links
2. Check your internet connection
3. NASA servers might be temporarily down - try again later
4. You may need to accept terms of use on the NASA website first

