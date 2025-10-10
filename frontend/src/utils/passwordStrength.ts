export const calculateStrength = (password: string): number => {
  let score = 0;

  if (password.length < 8) {
    return password.length > 0 ? 1 : 0;
  }

  const checks = [
    /[a-z]/,
    /[A-Z]/,
    /[0-9]/,
    /[^a-zA-Z0-9]/,
  ];

  let passedChecks = 0;
  checks.forEach(regex => {
    if (regex.test(password)) {
      passedChecks++;
    }
  });

  if (password.length >= 12 && passedChecks >= 4) {
    score = 4;
  } else if (password.length >= 8 && passedChecks >= 3) {
    score = 3;
  } else {
    score = 2;
  }
  
  return score;
};
