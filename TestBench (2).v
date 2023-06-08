module TestBench;

  reg clk;
  reg reset_n;
  reg [3:0] count_to;
  reg count_inc;
  reg count_dec;
  reg load_en;
  wire flag_count_max;
  wire flag_count_min;

  // Instantiate the Counter module
  Counter counter_inst (
    .clk(clk),
    .reset_n(reset_n),
    .count_to(count_to),
    .count_inc(count_inc),
    .count_dec(count_dec),
    .load_en(load_en),
    .flag_count_max(flag_count_max),
    .flag_count_min(flag_count_min)
  );

  // Clock generation
  always begin
    #5 clk = ~clk;
  end

  // Initialize inputs
  initial begin
    clk = 0;
    reset_n = 1;
    count_to = 4'b1111;
    count_inc = 0;
    count_dec = 0;
    load_en = 0;

    #10 reset_n = 0; // Assert reset
    #10 reset_n = 1; // Deassert reset

    #10 count_inc = 1; // Enable count increment
    #10 count_dec = 0; // Disable count decrement
    #20 count_inc = 0; // Disable count increment
    #20 count_dec = 1; // Enable count decrement
    #20 count_inc = 1; // Enable count increment
    #20 count_dec = 0; // Disable count decrement
    #10 count_inc = 0; // Disable count increment
    #10 count_dec = 0; // Disable count decrement

    #10 load_en = 1; // Enable count_to load
    #10 load_en = 0; // Disable count_to load

    #10 $finish; // End simulation
  end

  // Display output flags
  always @(flag_count_max or flag_count_min) begin
    $display("flag_count_max: %b, flag_count_min: %b", flag_count_max, flag_count_min);
  end

endmodule
