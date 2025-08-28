#!/usr/bin/env python3
"""
Test runner script for Smart Rental Tracker ML models.
Run different types of tests with command line options.
"""

import sys
import os
import argparse
from pathlib import Path

def run_validation():
    """Run basic validation tests."""
    print("🚀 Running Basic Validation...")
    os.system("python validate_models.py")

def run_basic_test():
    """Run basic model testing."""
    print("🚀 Running Basic Model Tests...")
    os.system("python test_models.py")

def run_comprehensive_test():
    """Run comprehensive testing."""
    print("🚀 Running Comprehensive Tests...")
    os.system("python comprehensive_test.py")

def run_interactive_test():
    """Run interactive testing."""
    print("🚀 Running Interactive Tests...")
    os.system("python interactive_test.py")

def run_all_tests():
    """Run all tests in sequence."""
    print("🚀 Running All Tests in Sequence...\n")
    
    tests = [
        ("Basic Validation", run_validation),
        ("Basic Model Tests", run_basic_test),
        ("Comprehensive Tests", run_comprehensive_test),
        ("Interactive Tests", run_interactive_test)
    ]
    
    for test_name, test_func in tests:
        print(f"\n{'='*60}")
        print(f"🧪 {test_name}")
        print(f"{'='*60}")
        test_func()
        print(f"\n✅ {test_name} completed")
    
    print(f"\n{'='*60}")
    print("🎉 ALL TESTS COMPLETED!")
    print(f"{'='*60}")

def show_test_info():
    """Show information about available tests."""
    print("🧪 Smart Rental Tracker - ML Model Testing\n")
    print("Available Test Types:")
    print("1. validation     - Basic validation (model files, imports)")
    print("2. basic          - Basic functionality testing")
    print("3. comprehensive  - Detailed analysis and performance testing")
    print("4. interactive    - Step-by-step interactive testing")
    print("5. all            - Run all tests in sequence")
    print("\nUsage Examples:")
    print("  python run_tests.py validation")
    print("  python run_tests.py basic")
    print("  python run_tests.py comprehensive")
    print("  python run_tests.py interactive")
    print("  python run_tests.py all")
    print("\nOr run individual scripts directly:")
    print("  python validate_models.py")
    print("  python test_models.py")
    print("  python comprehensive_test.py")
    print("  python interactive_test.py")

def main():
    """Main function to parse arguments and run tests."""
    parser = argparse.ArgumentParser(
        description="Test runner for Smart Rental Tracker ML models",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_tests.py validation     # Run basic validation
  python run_tests.py basic          # Run basic tests
  python run_tests.py comprehensive  # Run detailed tests
  python run_tests.py interactive    # Run interactive tests
  python run_tests.py all            # Run all tests
        """
    )
    
    parser.add_argument(
        'test_type',
        nargs='?',
        choices=['validation', 'basic', 'comprehensive', 'interactive', 'all'],
        help='Type of test to run'
    )
    
    parser.add_argument(
        '--info',
        action='store_true',
        help='Show information about available tests'
    )
    
    args = parser.parse_args()
    
    if args.info or not args.test_type:
        show_test_info()
        return
    
    # Check if we're in the right directory
    if not os.path.exists('demand_forecaster.py'):
        print("❌ Error: Please run this script from the ml/ directory")
        print("Current directory:", os.getcwd())
        return
    
    # Run the selected test
    test_functions = {
        'validation': run_validation,
        'basic': run_basic_test,
        'comprehensive': run_comprehensive_test,
        'interactive': run_interactive_test,
        'all': run_all_tests
    }
    
    if args.test_type in test_functions:
        try:
            test_functions[args.test_type]()
        except KeyboardInterrupt:
            print("\n\n⚠️  Testing interrupted by user")
        except Exception as e:
            print(f"\n❌ Error running {args.test_type} tests: {e}")
    else:
        print(f"❌ Unknown test type: {args.test_type}")
        show_test_info()

if __name__ == "__main__":
    main()
