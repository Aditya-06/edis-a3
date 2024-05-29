import CircuitBreaker from 'opossum';
import axios from 'axios';

// this function will be fired when the circuit breaker is closed
// i.e. --> this will be fired when the recc service is working well
const checkReccService = async (isbn: String): Promise<String[]> => {
  // add a timeout after which the request shall fail

  const response = await axios.get(
    `http://52.72.198.36/recommended-titles/isbn/${isbn}/`
  );
  return response.data;
};

const config: Object = {
  timeout: 3000, // Time in milliseconds
  resetTimeout: 6000, // Time in milliseconds
};

// Initialize the circuit breaker
const circuitBreaker = new CircuitBreaker(checkReccService, config);

export default circuitBreaker;
