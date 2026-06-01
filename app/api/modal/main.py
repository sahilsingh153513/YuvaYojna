import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity

def dynamic_job_match(user_skills, job_skill_list, min_support=0.3, min_confidence=0.6):
    te = TransactionEncoder()
    te_ary = te.fit(job_skill_list).transform(job_skill_list)
    df = pd.DataFrame(te_ary, columns=te.columns_)
    
    frequent_itemsets = apriori(df, min_support=min_support, use_colnames=True)
    rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=min_confidence)
    
    user_set = set([s.lower() for s in user_skills])
    suggested_skills = []
    for _, row in rules.iterrows():
        antecedent = set([x.lower() for x in row['antecedents']])
        consequent = set([x.lower() for x in row['consequents']])
        if antecedent.issubset(user_set) and not consequent.issubset(user_set):
            suggested_skills.extend(list(consequent - user_set))
    suggested_skills = list(set(suggested_skills))
    
    mlb = MultiLabelBinarizer()
    all_skills = job_skill_list + [user_skills]
    encoded = mlb.fit_transform(all_skills)
    job_matrix = encoded[:-1]
    user_vector = encoded[-1].reshape(1, -1)
    similarities = cosine_similarity(user_vector, job_matrix)[0]
    
    match_results = []
    for i, score in enumerate(similarities):
        match_results.append({
            "Job Index": i + 1,
            "Match %": round(score * 100, 2),
            "Required Skills": job_skill_list[i]
        })
    
    match_results = sorted(match_results, key=lambda x: x["Match %"], reverse=True)
    
    return {"Suggested Skills": suggested_skills, "Job Matches": match_results}
