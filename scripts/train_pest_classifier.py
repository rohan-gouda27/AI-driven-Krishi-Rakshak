"""
Trains a simple Naive Bayes classifier from CSV and exports JSON weights.
Usage: python scripts/train_pest_classifier.py data.csv public/pest_model.json

CSV format expected:
crop,weather,soil_moisture,symptom_leaf,symptom_borer,symptom_hopper,label
Rice,humid,wet,1,0,1,Brown Planthopper
...
"""

import json
import sys
from pathlib import Path

try:
    import pandas as pd
    from sklearn.naive_bayes import GaussianNB
    from sklearn.preprocessing import OneHotEncoder
    from sklearn.compose import ColumnTransformer
    from sklearn.pipeline import Pipeline
except ImportError:
    print("Error: scikit-learn and pandas are required.")
    print("Install with: pip install scikit-learn pandas")
    sys.exit(1)

def main():
    if len(sys.argv) < 3:
        print("Usage: python scripts/train_pest_classifier.py data.csv model_out.json")
        print("\nCSV should have columns: crop, weather, soil_moisture, symptom_*, label")
        return

    csv_path = Path(sys.argv[1])
    out_path = Path(sys.argv[2])
    
    if not csv_path.exists():
        print(f"Error: CSV file not found at {csv_path}")
        return
    
    print(f"[v0] Loading data from {csv_path}")
    df = pd.read_csv(csv_path)

    # Expected columns: crop, weather, soil_moisture, symptom_X..., label
    cat_cols = [c for c in ["crop", "weather", "soil_moisture"] if c in df.columns]
    num_cols = [c for c in df.columns if c.startswith("symptom_")]
    label_col = "label"
    
    if label_col not in df.columns:
        print(f"Error: CSV must include a '{label_col}' column")
        return
    
    print(f"[v0] Categorical features: {cat_cols}")
    print(f"[v0] Numeric features: {num_cols}")
    print(f"[v0] Training samples: {len(df)}")

    pre = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
            ("num", "passthrough", num_cols),
        ]
    )
    clf = Pipeline([("pre", pre), ("nb", GaussianNB())])
    X = df[cat_cols + num_cols]
    y = df[label_col]
    clf.fit(X, y)

    # Export via sklearn's classes/feature names
    encoder = clf.named_steps["pre"].transformers_[0][1]
    feature_names_cat = list(encoder.get_feature_names_out(cat_cols))
    feature_names_num = num_cols
    feature_names = feature_names_cat + feature_names_num

    # Extract GaussianNB parameters
    nb = clf.named_steps["nb"]
    model = {
        "classes": nb.classes_.tolist(),
        "theta": nb.theta_.tolist(),
        "var": nb.var_.tolist(),
        "class_count": nb.class_count_.tolist(),
        "feature_names": feature_names,
        "cat_cols": cat_cols,
        "num_cols": num_cols,
    }
    
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(model, indent=2))
    print(f"[v0] Model saved to {out_path}")
    print(f"[v0] Classes: {nb.classes_.tolist()}")
    print(f"[v0] Accuracy on training set: {clf.score(X, y):.2%}")

if __name__ == "__main__":
    main()
