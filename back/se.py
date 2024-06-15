import sympy as sp

def solve_expression(expression):
    # Convertir l'expression en un objet SymPy
    expr = sp.sympify(expression)
    
    # Résoudre l'expression
    result = sp.solve(expr)
    
    return result

if __name__ == "__main__":
    # Prendre l'expression mathématique de l'utilisateur
    expression = input("Entrez une expression mathématique à résoudre : ")
    
    # Résoudre l'expression
    solution = solve_expression(expression)
    
    # Afficher la solution
    print(f"La solution de l'expression '{expression}' est : {solution}")