![Billed](/wibmw/BillApp/blob/main/Billed-app-FR-Front/src/assets/images/logo.png?raw=true)



## Contexte
>Billed, une entreprise qui produit des solutions Saas destinées aux équipes de ressources humaines.
Dans deux semaines, l’équipe doit montrer la solution qui fonctionne à l’ensemble de l’entreprise. 
 

## Objectifs
L’objectif est la correction des derniers bugs et la mise en place de tests sur la fonctionnalité “note de frais”, avant de lancer officiellement auprès de nos clients d’ici 2 semaines. 


### Tâches
- **[Bug - report] :** 
Fixer les bugs identifiés dans le rapport de bug fourni par Jest. Une copie est disponible dans le kanban Notion.
***Règles/contraintes :*** 
Utiliser Chrome Debugger.
---
- **[Bug - hunt] :** 
Fixer les bugs identifiés par Leila sur le parcours employé. Ils sont décrits dans le kanban Notion.
***Règles/contraintes :*** 
Utiliser Chrome Debugger.
---
- **[Tests unitaires et d’intégration] :** 
Ajouter des tests unitaires et d’intégration pour les fichiers Bills et NewBill. Ils vont permettre d’éliminer les bugs et d’éviter toute régression lors des prochaines évolutions de la solution.
Certains tests sont déjà développés (pour le Login et pour le Dashboard côté administrateur RH) : ils sont déjà cochés sur le kanban. Il faut s’en inspirer pour les restants.
***Règles/contraintes :*** Il faut assurer un taux de couverture global des containers de 80% minimum (tests unitaires & tests d’intégration).
---
- **[Test End-to-End]  :** 
Rédiger un plan de test End-to-End (E2E) sur le parcours employé pour guider Leïla.
***Règles/contraintes :*** 
Manque de temps pour automatiser les tests (E2E). Ils seront effectués manuellement par Leila.
S’inspirer du plan E2E que Garance a déjà rédigé sur le parcours administrateur RH.
---
### Autres informations :

● ***L’application contient déjà des données test mais il est nécessaire d’en créer de nouvelles.***

● ***Des comptes administrateur et employé ont été créés pour les tests dans le readme du code front-end. Il faut les utiliser pour pouvoir charger une note de frais côté employé et la consulter côté administrateur RH.***

### Rapport de test :
![Test](/wibmw/BillApp/blob/main/Billed-app-FR-Front/src/assets/images/rapport_test.png?raw=true)

### Rapport de de couverture :
![Couverture](/wibmw/BillApp/blob/main/Billed-app-FR-Front/src/assets/images/rapport_couverture.png?raw=true)